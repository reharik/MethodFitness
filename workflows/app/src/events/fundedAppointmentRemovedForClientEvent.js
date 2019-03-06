module.exports = function(invariant) {
  return function({ clientId, trainerId, appointmentId }) {
    invariant(
      clientId,
      'fundedAppointmentRemovedForClient requires that you pass the clients id',
    );
    invariant(
      trainerId,
      'fundedAppointmentRemovedForClient requires that you pass the trainers Id',
    );
    invariant(
      appointmentId,
      'fundedAppointmentRemovedForClient requires that you pass the appointment id',
    );
    return {
      eventName: 'fundedAppointmentRemovedForClient',
      clientId,
      trainerId,
      appointmentId,
    };
  };
};
