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
            let session = sessions.find(s => s.appointmentType === x.appointmentType && !s.used);
            x.eventName = 'unfundedAppointmentFundedByClient';
            x.sessionId = session.sessionId;
            x.purchasePrice = session.purchasePrice;
            session.used = true;
            fundedAppointments.push(x);
          });
          this.unfundedAppointments = this.unfundedAppointments
            .filter(u => !fundedAppointments.some(f => u.appointmentId === f.appointmentId));
          cmd.sessions = sessions;
          this.raiseEvent(cmd);
          fundedAppointments.forEach(e => this.raiseEvent(e));
        },

        clientAttendsAppointment(cmd) {
          cmd.id = cmd.id || uuid.v4();
          const session = this.clientInventory.consumeSession(cmd);
          if (session) {
            cmd.eventName = 'appointmentAttendedByClient';
            cmd.sessionId = session.sessionId;
          } else {
            cmd.eventName = 'appointmentAttendedByUnfundedClient';
          }
          this.raiseEvent(cmd);
        },

        refundSessions(cmd) {
          this.expectSessionsExist(cmd);
          cmd.eventName = 'sessionsRefunded';
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
        sessionsPurchased: function(event) {
          this.clientInventory.addSessionsToInventory(event);
        }.bind(this),
        appointmentAttendedByClient: function(event) {
          this.clientInventory.removeSession(event.sessionId);
        }.bind(this),
        appointmentAttendedByUnfundedClient: function(event) {
          this.unfundedAppointments.push(event);
        }.bind(this),
        sessionsRefunded: function(event) {
          event.refundSessions.forEach(x => this.clientInventory.removeSession(x));
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
        purchasePrice,
        createdDate: moment().toISOString()
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

    expectSessionsExist(cmd) {
      invariant(this.clientInventory.sessionsExists(cmd), `Client does not have sessions with these Ids.
 It is possible that they have just been used, or there has been an error`);
    }
  };
};
