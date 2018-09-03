module.exports = function(invariant) {
  return function({ clientId, trainerId, appointmentId, appointmentType }) {
    invariant(
      clientId,
      'clientAttendsAppointmentCommand requires that you pass the clients id',
    );
    invariant(
      appointmentId,
      'clientAttendsAppointmentCommand requires that you pass the appointment id',
    );
    invariant(
      appointmentType,
      'clientAttendsAppointmentCommand requires that you pass the appointment type',
    );
    invariant(
      trainerId,
      'clientAttendsAppointmentCommand requires that you pass the trainer id',
    );
    return {
      commandName: 'clientAttendsAppointment',
      clientId,
      trainerId,
      appointmentId,
      appointmentType,
    };
  };
};
