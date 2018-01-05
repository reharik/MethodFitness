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

      fundedAppointmentAttendedByClient: event => {
        state.clientInventory.sessionConsumed(event.sessionId, event.appointmentId);
      },

      unfundedAppointmentAttendedByClient: event => {
        state.unfundedAppointments.push(event);
      },

      sessionsRefunded: event => {
        event.refundSessions.forEach(x => state.clientInventory.sessionConsumed(x.sessionId));
        console.log(`==========state.clientInventory=========`);
        console.log(JSON.stringify(state.clientInventory)); // eslint-disable-line quotes
        console.log(`==========END state.clientInventory=========`);
      },

      unfundedAppointmentFundedByClient: event => {
        state.unfundedAppointments = state.unfundedAppointments
          .filter(u => u.appointmentId !== event.appointmentId);
      },

      sessionReturnedFromPastAppointment: event => {
        state.clientInventory.replaceSession(event);
      },

      unfundedAppointmentRemovedForClient: event => {
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
