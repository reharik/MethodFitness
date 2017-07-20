module.exports = function(invariant) {
  return function({id,
                    clientId,
                    appointmentId,
                    appointmentType,
                    sessionId
                  }) {
    invariant(clientId, 'appointmentAttendedByClientEvent requires that you pass the clients id');
    invariant(appointmentId, 'appointmentAttendedByClientEvent requires that you pass the appointment id');
    invariant(appointmentType, 'appointmentAttendedByClientEvent requires that you pass the appointment type');
    invariant(appointmentType, 'appointmentAttendedByClientEvent requires that you pass the sessionId');
    return {
      eventName: 'appointmentAttendedByClientEvent',
      id,
      clientId,
      appointmentId,
      appointmentType,
      sessionId
    };
  };
};
