module.exports = function(invariant) {
  return function({
    clientId,
    trainerId,
    appointmentId,
    purchaseId,
    appointmentType,
    appointmentStartTime,
    appointmentDate,
  }) {
    invariant(
      clientId,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the clients id',
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
      purchaseId,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the purchase id',
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
      appointmentStartTime,
      'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment start time',
    );
    return {
      eventName: 'unfundedAppointmentAttendedByClient',
      clientId,
      trainerId,
      appointmentId,
      purchaseId,
      appointmentType,
      appointmentStartTime,
      appointmentDate,
    };
  };
};
