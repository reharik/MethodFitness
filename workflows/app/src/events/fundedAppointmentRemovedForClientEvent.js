module.exports = function(invariant) {
  return function({ clientId,
    appointmentId
  }) {
    invariant(clientId, 'fundedAppointmentRemovedForClient requires that you pass the clients id');
    invariant(appointmentId, 'fundedAppointmentRemovedForClient requires that you pass the appointment id');
    return {
      eventName: 'fundedAppointmentRemovedForClient',
      clientId,
      appointmentId
    };
  };
};
