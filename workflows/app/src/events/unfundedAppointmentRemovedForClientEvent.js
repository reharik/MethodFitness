module.exports = function(invariant) {
  return function({ clientId,
    appointmentType,
    appointmentId
  }) {
    invariant(clientId, 'unfundedAppointmentRemovedForClient requires that you pass the clients id');
    invariant(appointmentType, 'unfundedAppointmentRemovedForClient requires that you pass the appointment type');
    invariant(appointmentId, 'unfundedAppointmentRemovedForClient requires that you pass the appointment id');
    return {
      eventName: 'unfundedAppointmentRemovedForClient',
      clientId,
      appointmentType,
      appointmentId
    };
  };
};
