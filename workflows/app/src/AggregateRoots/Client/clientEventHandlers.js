module.exports = function() {
  return state => {
    return {
      clientAdded: event => {
        state._id = event.clientId;
      },

      clientArchived() {
        state._isArchived = true;
      },

      clientUnArchived() {
        state._isArchived = false;
      },

      sessionsPurchased: event => {
        state.clientInventory.addSessionsToInventory(event);
      },

      appointmentAttendedByClient: event => {
        state.clientInventory.removeSession(event.sessionId, event.appointmentId);
      },

      unfundedAppointmentAttendedByClient: event => {
        state.unfundedAppointments.push(event);
      },

      sessionsRefunded: event => {
        event.refundSessions.forEach(x => state.clientInventory.removeSession(x));
      },

      unfundedAppointmentFundedByClient: event => {
        state.unfundedAppointments = state.unfundedAppointments
          .filter(u => u.appointmentId !== event.appointmentId);
      },

      sessionReturnedFromPastAppointment: event => {
        state.clientInventory.replaceSession(event);
      },

      unfundedAppointmentRemoveForClient: event => {
        state.unfundedAppointments = state.unfundedAppointments
          .filter(u => u.appointmentId !== event.appointmentId);
      },

      sessionTransferredFromRemovedAppointmentToUnfundedAppointment: event => {
        state.unfundedAppointments = state.unfundedAppointments
          .filter(u => u.appointmentId !== event.appointmentId);
        state.clientInventory.modifyConsumedSession(event);
      }
    };
  };
};
