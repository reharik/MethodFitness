module.exports = function(invariant) {
  return function({
    appointmentId,
    clients,
    entityName,
    createdDate,
    createdById,
  }) {
    invariant(
      appointmentId,
      `Remove Appointment From Past requires that you pass the AppointmentId`,
    );
    invariant(
      clients,
      `Remove Appointment From Past requires that you pass the clients associated with appointment`,
    );
    invariant(
      entityName,
      `Remove Appointment From Past requires that you pass the 
      enitityName since it's a date but the date prop is utc`,
    );
    return {
      commandName: 'removeAppointmentFromPast',
      appointmentId,
      clients,
      entityName,
      createdDate,
      createdById,
    };
  };
};
