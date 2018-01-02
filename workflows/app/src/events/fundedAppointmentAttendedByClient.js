module.exports = function(invariant) {
  return function({ clientId,
    appointmentId,
    appointmentType,
    sessionId
  }) {
    invariant(clientId, 'fundedAppointmentAttendedByClientEvent requires that you pass the clients id');
    invariant(appointmentId, 'fundedAppointmentAttendedByClientEvent requires that you pass the appointment id');
    invariant(appointmentType, 'fundedAppointmentAttendedByClientEvent requires that you pass the appointment type');
    invariant(sessionId, 'fundedAppointmentAttendedByClientEvent requires that you pass the sessionId');
    return {
      eventName: 'fundedAppointmentAttendedByClient',
      clientId,
      appointmentId,
      appointmentType,
      sessionId
    };
  };
};
