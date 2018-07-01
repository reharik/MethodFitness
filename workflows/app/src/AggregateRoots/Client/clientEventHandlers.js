module.exports = function() {
  return state => {
    return {
      clientAdded: event => {
        state._id = event.clientId;
      },

      clientArchived() {
        state._isArchived = true;
      },

      clientUnarchived() {
        state._isArchived = false;
      },

      sessionsPurchased: event => {
        state.clientInventory.addSessionsToInventory(event);
      },

      fundedAppointmentAttendedByClient: event => {
        state.clientInventory.sessionConsumed(
          event.sessionId,
          event.appointmentId,
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
                  date: event.date,
                  startTime: event.startTime,
                  endTime: event.endTime,
                })
              : x,
        );
      },
    };
  };
};
