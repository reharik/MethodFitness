module.exports = function() {
  return state => {
    return {
      clientAdded: event => {
        state._id = event.clientId;
        state.firstName = event.contact.firstName;
        state.lastName = event.contact.lastName;
        state.clientRates = event.clientRates;
      },

      clientArchived() {
        state._isArchived = true;
      },

      clientUnarchived() {
        state._isArchived = false;
      },

      clientContactUpdated(event) {
        state.firstName = event.contact.firstName;
        state.lastName = event.contact.lastName;
      },

      sessionsPurchased: event => {
        state.clientInventory.addSessionsToInventory(event);
      },

      fundedAppointmentAttendedByClient: event => {
        state.clientInventory.sessionConsumed(
          event.sessionId,
          event.appointmentId,
          event.trainerPay,
          event.trainerPercentage,
          event.trainerId,
        );
      },

      unfundedAppointmentAttendedByClient: event => {
        state.unfundedAppointments.push(event);
      },

      sessionsRefunded: event => {
        event.refundSessions.forEach(x =>
          state.clientInventory.sessionConsumed(x.sessionId),
        );
      },

      unfundedAppointmentFundedByClient: event => {
        state.unfundedAppointments = state.unfundedAppointments.filter(
          u => u.appointmentId !== event.appointmentId,
        );
      },

      sessionReturnedFromPastAppointment: event => {
        state.clientInventory.replaceSession(event);
      },

      unfundedAppointmentRemovedForClient: event => {
        state.unfundedAppointments = state.unfundedAppointments.filter(
          u => u.appointmentId !== event.appointmentId,
        );
      },

      sessionTransferredFromRemovedAppointmentToUnfundedAppointment: event => {
        state.unfundedAppointments = state.unfundedAppointments.filter(
          u => u.appointmentId !== event.appointmentId,
        );
        state.clientInventory.modifyConsumedSession(event);
      },

      clientInternalStateUpdated: event => {
        state.unfundedAppointments = state.unfundedAppointments.map(
          x =>
            x.appointmentId === event.appointmentId
              ? Object.assign({}, x, {
                  trainerId: event.trainerId,
                  appointmentType: event.appointmentType,
                  clients: event.clients,
                  appointmentDate: event.appointmentDate,
                  startTime: event.startTime,
                  endTime: event.endTime,
                })
              : x,
        );
      },

      clientRatesUpdated: event => {
        state.clientRates = event.clientRates;
      },
    };
  };
};
