module.exports = function(invariant, riMoment) {
  return function({ clientId, trainerId, appointmentId, appointmentType, startTime, date }) {
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
      date,
      'clientAttendsAppointmentCommand requires that you pass the appointment date',
    );

    return {
      commandName: 'clientAttendsAppointment',
      clientId,
      trainerId,
      appointmentId,
      appointmentType,
             startTime: riStartTime, date
    };
  };
};
