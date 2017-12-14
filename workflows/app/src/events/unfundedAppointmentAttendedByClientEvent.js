module.exports = function(invariant) {
  return function({ clientId,
    appointmentId,
    appointmentType
  }) {
    invariant(clientId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the clients id');
    invariant(appointmentId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment id');
    invariant(appointmentType, 'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment type');
    return {
      eventName: 'unfundedAppointmentAttendedByClient',
      clientId,
      appointmentId,
      appointmentType
    };
  };
};
