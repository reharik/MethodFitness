module.exports = function(invariant) {
  return function({
    clientId,
    clientFirstName,
    clientLastName,
    appointmentId,
    appointmentType,
    appointmentDate,
    startTime,
    pricePerSession,
    trainerId,
    trainerPercentage,
    trainerPay,
    sessionId,
    createdDate,
    createdById,
    //TODO remove after migration
    migration,
  }) {
    invariant(
      clientId,
      'fundedAppointmentAttendedByClientEvent requires that you pass the clients id',
    );
    invariant(
      clientFirstName,
      'fundedAppointmentAttendedByClientEvent requires that you pass the clients first name',
    );
    invariant(
      clientLastName,
      'fundedAppointmentAttendedByClientEvent requires that you pass the clients last name',
    );
    invariant(
      appointmentId,
      'fundedAppointmentAttendedByClientEvent requires that you pass the appointment id',
    );
    invariant(
      appointmentType,
      'fundedAppointmentAttendedByClientEvent requires that you pass the appointment type',
    );
    invariant(
      appointmentDate,
      'fundedAppointmentAttendedByClientEvent requires that you pass the appointment date',
    );
    invariant(
      startTime,
      'fundedAppointmentAttendedByClientEvent requires that you pass the appointment start time',
    );
    invariant(
      sessionId,
      'fundedAppointmentAttendedByClientEvent requires that you pass the sessionId',
    );
    invariant(
      trainerId,
      'fundedAppointmentAttendedByClientEvent requires that you pass the trainer Id',
    );
    invariant(
      pricePerSession,
      'fundedAppointmentAttendedByClientEvent requires that you pass the price per session',
    );
    invariant(
      trainerPercentage,
      'fundedAppointmentAttendedByClientEvent requires that you pass the trainers percentage',
    );
    invariant(
      trainerPay,
      'fundedAppointmentAttendedByClientEvent requires that you pass the trainer pay',
    );

    return {
      eventName: 'fundedAppointmentAttendedByClient',
      clientId,
      clientFirstName,
      clientLastName,
      appointmentId,
      appointmentType,
      appointmentDate,
      startTime,
      pricePerSession,
      trainerId,
      trainerPercentage,
      trainerPay,
      sessionId,
      createdDate,
      createdById,
      //TODO remove after migration
      migration,
    };
  };
};
