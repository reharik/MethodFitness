module.exports = function(invariant) {
  return function({
    appointmentId,
    clientId,
    appointmentType,
    sessionId,
                    createdDate,
                    createdById
  }) {
    invariant(clientId, 'Session Returned From Past Appointment requires that you pass the client id');
    invariant(sessionId, 'Session Returned From Past Appointment requires that you pass the session id');
    invariant(appointmentId, 'Session Returned From Past Appointment requires that you pass the appointment id');
    invariant(appointmentType, 'Session Returned From Past Appointment requires that you pass the appointment type');
    return {
      eventName: 'sessionReturnedFromPastAppointment',
      clientId,
      appointmentId,
      appointmentType,
      sessionId,
      createdDate,
      createdById
    };
  };
};
