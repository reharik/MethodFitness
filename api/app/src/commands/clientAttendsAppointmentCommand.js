module.exports = function(invariant) {
  return function({
                     clientId,
                     appointmentId,
                     appointmentType
                   }) {
    invariant(clientId, 'clientAttendsAppointmentCommand requires that you pass the clients id');
    invariant(appointmentId, 'clientAttendsAppointmentCommand requires that you pass the appointment id');
    invariant(appointmentType, 'clientAttendsAppointmentCommand requires that you pass the appointment type');
    return {
      clientId,
      appointmentId,
      appointmentType
    };
  };
};
