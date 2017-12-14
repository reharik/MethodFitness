module.exports = function(invariant) {
  return function({ clientId,
    appointmentId
  }) {
    invariant(clientId, 'unfundedAppointmentRemovedForClient requires that you pass the clients id');
    invariant(appointmentId, 'unfundedAppointmentRemovedForClient requires that you pass the appointment id');
    return {
      eventName: 'unfundedAppointmentRemovedForClient',
      clientId,
      appointmentId
    };
  };
};
