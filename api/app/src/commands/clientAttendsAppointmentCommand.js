module.exports = function(invariant, riMoment) {
  return function({ clientId, trainerId, appointmentId, appointmentType, startTime, appointmentDate }) {
    const riStartTime = riMoment(startTime).format();
    invariant(
      clientId,
      'clientAttendsAppointmentCommand requires that you pass the clients id',
    );
    invariant(
      trainerId,
      'clientAttendsAppointmentCommand requires that you pass the trainer id',
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
      riStartTime,
      'clientAttendsAppointmentCommand requires that you pass the appointment start time',
    );
    invariant(
      appointmentDate,
      'clientAttendsAppointmentCommand requires that you pass the appointment appointmentDate',
    );

    return {
      commandName: 'clientAttendsAppointment',
      clientId,
      trainerId,
      appointmentId,
      appointmentType,
             startTime: riStartTime,
      appointmentDate
    };
  };
};
