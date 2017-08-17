module.exports = function(AggregateRootBase, ClientInventory, esEvents, invariant, uuid, logger) {
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
          let cmdClone = Object.assign({}, cmd);
          cmdClone.id = cmdClone.id || uuid.v4();
          this.raiseEvent(esEvents.clientAddedEvent(cmdClone));
        },
        updateClientInfo(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientInfoUpdatedEvent(cmdClone));
        },
        updateClientSource(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientSourceUpdatedEvent(cmdClone));
        },
        updateClientContact(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientContactUpdatedEvent(cmdClone));
        },
        updateClientAddress(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientAddressUpdatedEvent(cmdClone));
        },
        archiveClient(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.clientArchivedEvent(cmdClone));
        },
        unArchiveClient(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectArchived();
          this.raiseEvent(esEvents.clientUnarchivedEvent(cmdClone));
        },
        purchase(cmd) {
          let cmdClone = Object.assign({}, cmd);
          cmdClone.id = cmdClone.id || uuid.v4();
          let sessions = this.generateSessions(cmdClone);
          let fundedAppointments = [];
          logger.debug(`unfundedAppointments: ${JSON.stringify(this.unfundedAppointments)}`);
          this.unfundedAppointments.forEach(x => {
            let session = sessions.find(s => s.appointmentType === x.appointmentType && !s.used);
            if (session) {
              x.sessionId = session.sessionId;
              x.purchasePrice = session.purchasePrice;
              session.used = true;
              session.appointmentId = x.appointmentId;
              fundedAppointments.push(x);
            }
          });
          logger.debug(`newlyFundedAppointments: ${JSON.stringify(fundedAppointments)}`);

          cmdClone.sessions = sessions;
          this.raiseEvent(esEvents.sessionsPurchasedEvent(cmdClone));
          fundedAppointments.forEach(e => this.raiseEvent(esEvents.unfundedAppointmentFundedByClientEvent(e)));
        },

        clientAttendsAppointment(cmd) {
          let cmdClone = Object.assign({}, cmd);
          let event;
          cmdClone.id = cmdClone.id || uuid.v4();
          const session = this.clientInventory.consumeSession(cmdClone);
          if (session) {
            cmdClone.sessionId = session.sessionId;
            event = esEvents.appointmentAttendedByClientEvent(cmdClone);
          } else {
            event = esEvents.unfundedAppointmentAttendedByClientEvent(cmdClone);
          }
          this.raiseEvent(event);
        },

        refundSessions(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectSessionsExist(cmdClone);
          this.raiseEvent(esEvents.sessionsRefundedEvent(cmdClone));
        },

        returnSessionFromPast(appointmentId) {
          const session = this.clientInventory.getUsedSessionByAppointmentId(appointmentId);
          const event = esEvents.sessionReturnedFromPastAppointmentEvent({
            appointmentId,
            sessionId: session.sessionId,
            clientId: this._id});
          this.raiseEvent(event);
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
          this.clientInventory.removeSession(event.sessionId, event.appointmentId);
        }.bind(this),
        unfundedAppointmentAttendedByClient: function(event) {
          this.unfundedAppointments.push(event);
        }.bind(this),
        sessionsRefunded: function(event) {
          event.refundSessions.forEach(x => this.clientInventory.removeSession(x));
        }.bind(this),
        unfundedAppointmentFundedByClient: function(event) {
          this.unfundedAppointments = this.unfundedAppointments
            .filter(u => u.appointmentId !== event.appointmentId);
        }.bind(this),
        sessionReturnedFromPastAppointment: function(event) {
          this.unfundedAppointments = this.unfundedAppointments
            .filter(u => u.appointmentId !== event.appointmentId);
          this.clientInventory.replaceSession(event);
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
