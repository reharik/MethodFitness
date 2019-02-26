module.exports = function(invariant) {
  return function({
    appointmentId,
    appointmentDate,
    appointmentStartTime,
    sessionId,
    clientId,
  }) {
    invariant(
      appointmentId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the appointment id',
    );

    invariant(
      appointmentDate,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the appointment date',
    );
    invariant(
      appointmentStartTime,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the appointment start time',
    );
    invariant(
      sessionId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the sessionId',
    );
    invariant(
      clientId,
      'sessionTransferredFromRemovedAppointmentToUnfundedAppointment requires that' +
        ' you pass the clientId',
    );
    return {
      eventName:
        'sessionTransferredFromRemovedAppointmentToUnfundedAppointment',
      appointmentId,
      appointmentDate,
      appointmentStartTime,
      sessionId,
      clientId,
    };
  };
};
