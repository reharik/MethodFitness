module.exports = function(invariant) {
  return function({ appointmentId,
    sessionId,
    clientId
  }) {
    invariant(appointmentId, 'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
      ' you pass the appointment id');
    invariant(sessionId, 'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
      ' you pass the sessionId');
    invariant(clientId, 'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
      ' you pass the clientId');
    return {
      eventName: 'sessionTransferredFromRemovedAppointmentToUnfundedAppointment',
      appointmentId,
      sessionId,
      clientId
    };
  };
};
