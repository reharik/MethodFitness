module.exports = function(invariant) {
  return function({ clientId,
                    appointmentId
}) {
    invariant(clientId, 'unfundedAppointmentRemoveForClient requires that you pass the clients id');
    invariant(appointmentId, 'unfundedAppointmentRemoveForClient requires that you pass the appointment id');
    return {
      eventName: 'unfundedAppointmentRemoveForClient',
      clientId,
      appointmentId
    };
  };
};
