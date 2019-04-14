module.exports = function(invariant) {
  return function({
    clientId,
    clientFirstName,
    clientLastName,
    trainerId,
    appointmentId,
    appointmentType,
    startTime,
    appointmentDate,
    trainerPercentage,
                    createdDate,
                    createdById,
                    //TODO remove after migration
                    migration
  }) {
    invariant(
      clientId,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the clients id',
    );
    invariant(
      clientFirstName,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the clients first name',
    );
    invariant(
      clientLastName,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the clients last name',
    );
    invariant(
      trainerId,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the trainer id',
    );
    invariant(
      appointmentId,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment id',
    );
    invariant(
      appointmentType,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment type',
    );
    invariant(
      appointmentDate,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment date',
    );
    invariant(
      startTime,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment start time',
    );
    invariant(
      trainerPercentage,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the trainers percentage',
    );
    return {
      eventName: 'unfundedAppointmentAttendedByClient',
      clientId,
      clientFirstName,
      clientLastName,
      trainerId,
      appointmentId,
      appointmentType,
      startTime,
      appointmentDate,
      trainerPercentage,
      createdDate,
      createdById,
      //TODO remove after migration
      migration
    };
  };
};
