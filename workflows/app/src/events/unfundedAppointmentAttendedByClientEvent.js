module.exports = function(invariant) {
  return function({
    clientId,
    trainerId,
    appointmentId,
    appointmentType
  }) {
    invariant(clientId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the clients id');
    invariant(trainerId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the trainer id');
    invariant(appointmentId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment id');
    invariant(appointmentType, 'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment type');
    return {
      eventName: 'unfundedAppointmentAttendedByClient',
      clientId,
      trainerId,
      appointmentId,
      appointmentType
    };
  };
};
