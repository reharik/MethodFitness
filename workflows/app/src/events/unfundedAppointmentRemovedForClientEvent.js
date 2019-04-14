module.exports = function(invariant) {
  return function({ clientId, appointmentType, appointmentId, trainerId,
                    createdDate,
                    createdById
  }) {
    invariant(
      clientId,
      'unfundedAppointmentRemovedForClient requires that you pass the clients id',
    );
    invariant(
      appointmentType,
      'unfundedAppointmentRemovedForClient requires that you pass the appointment type',
    );
    invariant(
      appointmentId,
      'unfundedAppointmentRemovedForClient requires that you pass the appointment id',
    );
    invariant(
      trainerId,
      'unfundedAppointmentRemovedForClient requires that you pass the trainer id',
    );
    return {
      eventName: 'unfundedAppointmentRemovedForClient',
      clientId,
      appointmentType,
      appointmentId,
      trainerId,
      createdDate,
      createdById
    };
  };
};
