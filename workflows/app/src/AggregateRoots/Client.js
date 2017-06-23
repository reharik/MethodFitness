module.exports = function(AggregateRootBase, ClientInventory, moment, invariant, uuid) {
  return class Client extends AggregateRootBase {
    constructor() {
      super();
      this._isArchived = false;
      this.type = 'Client';
      this.clientInventory = new ClientInventory();
      this.unfundedAppointments = [];
    }

    static aggregateName() {
      return 'Client';
    }

    commandHandlers() {
      return {
        addClient(cmd) {
          cmd.id = cmd.id || uuid.v4();
          cmd.eventName = 'clientAdded';
          this.raiseEvent(cmd);
        },
        updateClientInfo(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientInfoUpdated';
          this.raiseEvent(cmd);
        },
        updateClientSource(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientSourceUpdated';
          this.raiseEvent(cmd);
        },
        updateClientContact(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientContactUpdated';
          this.raiseEvent(cmd);
        },
        updateClientAddress(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientAddressUpdated';
          this.raiseEvent(cmd);
        },
        archiveClient() {
          this.expectNotArchived();
          this.raiseEvent({
            eventName: 'clientArchived',
            id: this._id,
            archivedDate: new Date()
          });
        },
        unArchiveClient() {
          this.expectArchived();
          this.raiseEvent({
            eventName: 'clientUnArchived',
            id: this._id,
            unArchivedDate: new Date()
          });
        },
        purchase(cmd) {
          cmd.id = cmd.id || uuid.v4();
          cmd.eventName = 'sessionsPurchased';
          cmd.purchaseDate = moment().toISOString();
          let sessions = this.generateSessions(cmd);
          let fundedAppointments = [];
          this.unfundedAppointments.forEach(x => {
            let session = sessions.first(s => s.appointmentType === x.appointmentType && !s.used);
            x.eventName = 'unfundedAppointmentFundedByClient';
            x.sessionId = session.sessionId;
            x.purchasePrice = session.purchasePrice;
            session.used = true;
            fundedAppointments.push(x);
          });
          fundedAppointments.forEach(e => this.raiseEvent(e));
          this.unfundedAppointments = this.unfundedAppointments
            .filter(u => !fundedAppointments.some(f => u.appointmentId === f.appointmentId));
          cmd.sessions = sessions;
          this.raiseEvent(cmd);
        },

        clientAttendsAppointment(cmd) {
          cmd.id = cmd.id || uuid.v4();
          if (cmd.sessionId) {
            cmd.eventName = 'appointmentAttendedByClient';
          } else {
            cmd.eventName = 'appointmentAttendedByUnfundedClient';
          }
          this.raiseEvent(cmd);
        }
      };
    }

    applyEventHandlers() {
      return {
        clientAdded: function(event) {
          this._id = event.id;
        }.bind(this),

        clientArchived: function() {
          this._isArchived = true;
        }.bind(this),
        clientUnArchived: function() {
          this._isArchived = false;
        }.bind(this),
        fullHourSessionPurchased: function(event) {
          if (!event.used) {
            this.clientInventory.addFullHourSession(event);
          }
        }.bind(this),
        halfHourSessionPurchased: function(event) {
          if (!event.used) {
            this.clientInventory.addHalfHourSession(event);
          }
        }.bind(this),
        pairSessionPurchased: function(event) {
          if (!event.used) {
            this.clientInventory.addPairSession(event);
          }
        }.bind(this),
        appointmentAttendedByClient: function(event) {
          this.clientInventory.adjustInventory(event);
        }.bind(this),
        appointmentAttendedByUnfundedClient: function(event) {
          this.clientInventory.adjustInventory(event);
          this.unfundedAppointments.push(event);
        }.bind(this)
      };
    }

    generateSessions(cmd) {
      return [].concat(
        this.addSessions(cmd, 'fullHour'),
        this.addSessions(cmd, 'halfHour'),
        this.addSessions(cmd, 'pair'));
    }

    createNewSessionEvent(type, purchasePrice, purchaseId) {
      return {
        clientId: this._id,
        sessionId: uuid.v4(),
        appointmentType: type,
        purchaseId,
        purchasePrice
      };
    }

    addSessions(cmd, type) {
      const individualPrice = cmd[type] ? cmd[`${type}Total`] / cmd[type] : 0;
      const tenPackPrice = cmd[`${type}TenPack`] ? cmd[`${type}TenPackTotal`] / (cmd[`${type}TenPack`] * 10) : 0;
      let sessions = [];
      for (let i = 0; i < cmd[type]; i++) {
        sessions.push(this.createNewSessionEvent(type, individualPrice, cmd.id));
      }
      for (let i = 0; i < cmd[`${type}TenPack`] * 10; i++) {
        sessions.push(this.createNewSessionEvent(type, tenPackPrice, cmd.id));
      }
      return sessions;
    }

    expectNotArchived() {
      invariant(!this._isArchived, 'Client already archived');
    }

    expectArchived() {
      invariant(this._isArchived, 'Client is not archived archived');
    }
  };
};
