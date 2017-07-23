module.exports = function(invariant) {
  return function({id,
                    clientId,
                    appointmentId,
                    appointmentType
                  }) {
    invariant(clientId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the clients id');
    invariant(appointmentId, 'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment id');
    invariant(appointmentType, 'unfundedAppointmentAttendedByClientEvent requires that you pass the appointment type');
    return {
      eventName: 'unfundedAppointmentAttendedByClientEvent',
      id,
      clientId,
      appointmentId,
      appointmentType
    };
  };
};
