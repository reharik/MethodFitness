module.exports = function(
  clientInvariants,
  esEvents,
  uuid,
  logger,
  metaLogger
) {
  return (raiseEvent, state) => {
    const invariants = clientInvariants(state);
    const generateSessions = cmd => {
      return [].concat(
        addSessions(cmd, 'fullHour'),
        addSessions(cmd, 'halfHour'),
        addSessions(cmd, 'pair'));
    };

    const createNewSessionEvent = (type, purchasePrice, cmd) => {
      return {
        clientId: state._id,
        sessionId: uuid.v4(),
        appointmentType: type,
        purchaseId: cmd.purchaseId,
        purchasePrice,
        createdDate: cmd.createDate
      };
    };

    const addSessions = (cmd, type) => {
      const individualPrice = cmd[type] ? cmd[`${type}Total`] / cmd[type] : 0;
      const tenPackPrice = cmd[`${type}TenPack`] ? cmd[`${type}TenPackTotal`] / (cmd[`${type}TenPack`] * 10) : 0;
      let sessions = [];
      for (let i = 0; i < cmd[type]; i++) {
        sessions.push(createNewSessionEvent(type, individualPrice, cmd));
      }
      for (let i = 0; i < cmd[`${type}TenPack`] * 10; i++) {
        sessions.push(createNewSessionEvent(type, tenPackPrice, cmd));
      }
      return sessions;
    };

    return metaLogger({
      addClient: cmd => {
        let cmdClone = Object.assign({}, cmd);
        cmdClone.clientId = cmdClone.clientId || uuid.v4();
        raiseEvent(esEvents.clientAddedEvent(cmdClone));
      },

      updateClientInfo: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        raiseEvent(esEvents.clientInfoUpdatedEvent(cmdClone));
      },

      updateClientSource: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        raiseEvent(esEvents.clientSourceUpdatedEvent(cmdClone));
      },

      updateClientContact: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        raiseEvent(esEvents.clientContactUpdatedEvent(cmdClone));
      },

      updateClientAddress: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        raiseEvent(esEvents.clientAddressUpdatedEvent(cmdClone));
      },

      archiveClient: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        raiseEvent(esEvents.clientArchivedEvent(cmdClone));
      },

      unArchiveClient: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectArchived();
        raiseEvent(esEvents.clientUnarchivedEvent(cmdClone));
      },

      purchase: cmd => {
        let cmdClone = Object.assign({}, cmd);
        cmdClone.purchaseId = cmdClone.purchaseId || uuid.v4();
        let sessions = generateSessions(cmdClone);
        let fundedAppointments = [];
        state.unfundedAppointments.forEach(x => {
          let session = sessions.find(s => s.appointmentType === x.appointmentType && !s.used);
          if (session) {
            x.sessionId = session.sessionId;
            x.purchasePrice = session.purchasePrice;
            session.used = true;
            session.appointmentId = x.appointmentId;
            session.trainerId = x.trainerId;
            fundedAppointments.push(x);
          }
        });

        cmdClone.sessions = sessions;
        raiseEvent(esEvents.sessionsPurchasedEvent(cmdClone));
        fundedAppointments.forEach(e => raiseEvent(esEvents.unfundedAppointmentFundedByClientEvent(e)));
      },

      clientAttendsAppointment: cmd => {
        let cmdClone = Object.assign({}, cmd);
        let event;
        const session = state.clientInventory.consumeSession(cmdClone);
        cmdClone.clientId = state._id;
        if (session) {
          cmdClone.sessionId = session.sessionId;
          // in case this is an update of an appointment in the past
          event = esEvents.fundedAppointmentAttendedByClient(cmdClone);
        } else {
          event = esEvents.unfundedAppointmentAttendedByClientEvent(cmdClone);
        }
        raiseEvent(event);
      },

      refundSessions: cmd => {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectSessionsExist(cmdClone);
        raiseEvent(esEvents.sessionsRefundedEvent(cmdClone));
      },

      removePastAppointmentForClient: appointmentId => {
        const unfundedAppointment = state.unfundedAppointments.find(u => u.appointmentId === appointmentId);
        if (unfundedAppointment) {
          raiseEvent(esEvents.unfundedAppointmentRemovedForClientEvent({
            appointmentId,
            trainerId: unfundedAppointment.trainerId,
            appointmentType: unfundedAppointment.appointmentType,
            clientId: state._id
          }));
        } else {
          raiseEvent(esEvents.fundedAppointmentRemovedForClientEvent({
            appointmentId,
            clientId: state._id
          }));
        }
      },

      returnSessionFromPast: appointmentId => {
        const session = state.clientInventory.getUsedSessionByAppointmentId(appointmentId);
        if (!session) {
          logger.debug(`No session associated with appointment Id: ${appointmentId} found!`);
          return;
        }

        let event;
        const unfundedAppointment = state.unfundedAppointments
          .find(x => x.appointmentType === session.appointmentType);

        if (unfundedAppointment) {
          event = esEvents.sessionTransferredFromRemovedAppointmentToUnfundedAppointment({
            clientId: state._id,
            sessionId: session.sessionId,
            appointmentId: unfundedAppointment.appointmentId
          });
        } else {
          event = esEvents.sessionReturnedFromPastAppointmentEvent({
            appointmentId,
            sessionId: session.sessionId,
            clientId: state._id,
            appointmentType: session.appointmentType
          });
        }
        raiseEvent(event);
      },

      updateAppointmentFromPast: cmd => {
        const unfundedAppointment = state.unfundedAppointments
          .find(x => x.appointmentId === cmd.appointmentId);
        if (unfundedAppointment) {
          raiseEvent(esEvents.clientInternalStateUpdatedEvent(cmd));
        }
      }

    }, 'ClientCommands');
  };
};
