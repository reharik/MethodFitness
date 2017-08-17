module.exports = function(invariant) {
  return function({appointmentId, clientId, sessionId}) {
    invariant(clientId, 'Session Returned From Past Appointment requires that you pass the client id');
    invariant(sessionId, 'Session Returned From Past Appointment requires that you pass the session id');
    invariant(appointmentId, 'Session Returned From Past Appointment requires that you pass the appointment id');
    return {
      eventName: 'sessionReturnedFromPastAppointment',
      clientId,
      appointmentId,
      sessionId
    };
  };
};
