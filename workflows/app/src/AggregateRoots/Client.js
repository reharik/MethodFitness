module.exports = function(AggregateRootBase, ClientInventory, esEvents, invariant, uuid) {
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
          this.raiseEvent(esEvents.clientAddedEvent(cmd));
        },
        updateClientInfo(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientInfoUpdatedEvent(cmd));
        },
        updateClientSource(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientSourceUpdatedEvent(cmd));
        },
        updateClientContact(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientContactUpdatedEvent(cmd));
        },
        updateClientAddress(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientAddressUpdatedEvent(cmd));
        },
        archiveClient(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientArchivedEvent(cmd));
        },
        unArchiveClient(cmd) {
          this.expectArchived();
          this.raiseEvent(esEvents.clientUnarchivedEvent(cmd));
        },
        purchase(cmd) {
          cmd.id = cmd.id || uuid.v4();
          let sessions = this.generateSessions(cmd);
          let fundedAppointments = [];
          this.unfundedAppointments.forEach(x => {
            let session = sessions.find(s => s.appointmentType === x.appointmentType && !s.used);
            x.sessionId = session.sessionId;
            x.purchasePrice = session.purchasePrice;
            session.used = true;
            fundedAppointments.push(x);
          });
          this.unfundedAppointments = this.unfundedAppointments
            .filter(u => !fundedAppointments.some(f => u.appointmentId === f.appointmentId));
          cmd.sessions = sessions;
          this.raiseEvent(esEvents.sessionsPurchasedEvent(cmd));
          fundedAppointments.forEach(e => this.raiseEvent(esEvents.unfundedAppointmentFundedByClientEvent(e)));
        },

        clientAttendsAppointment(cmd) {
          let event = esEvents.unfundedAppointmentAttendedByClientEvent(cmd);
          cmd.id = cmd.id || uuid.v4();
          const session = this.clientInventory.consumeSession(cmd);
          if (session) {
            cmd.sessionId = session.sessionId;
            event = esEvents.appointmentAttendedByClientEvent(cmd);
          }
          this.raiseEvent(event);
        },

        refundSessions(cmd) {
          this.expectSessionsExist(cmd);
          this.raiseEvent(esEvents.sessionsRefundedEvent(cmd));
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
          this.clientInventory.removeSession(event);
        }.bind(this),
        unfundedAppointmentAttendedByClient: function(event) {
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

    createNewSessionEvent(type, purchasePrice, cmd) {
      return {
        clientId: this._id,
        sessionId: uuid.v4(),
        appointmentType: type,
        purchaseId: cmd.id,
        purchasePrice,
        createdDate: cmd.createDate
      };
    }

    addSessions(cmd, type) {
      const individualPrice = cmd[type] ? cmd[`${type}Total`] / cmd[type] : 0;
      const tenPackPrice = cmd[`${type}TenPack`] ? cmd[`${type}TenPackTotal`] / (cmd[`${type}TenPack`] * 10) : 0;
      let sessions = [];
      for (let i = 0; i < cmd[type]; i++) {
        sessions.push(this.createNewSessionEvent(type, individualPrice, cmd));
      }
      for (let i = 0; i < cmd[`${type}TenPack`] * 10; i++) {
        sessions.push(this.createNewSessionEvent(type, tenPackPrice, cmd));
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
