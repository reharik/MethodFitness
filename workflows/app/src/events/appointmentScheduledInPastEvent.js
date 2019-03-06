module.exports = function() {
  return function({
    appointmentId,
    locationId,
    locationName,
    appointmentType,
    date,
    startTime,
    endTime,
    trainerId,
    trainerFirstName,
    trainerLastName,
    color,
    clients,
    notes,
    entityName,
  }) {
    return {
      eventName: 'appointmentScheduledInPast',
      appointmentId,
      locationId,
      locationName,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      trainerFirstName,
      trainerLastName,
      color,
      clients,
      notes,
      entityName,
    };
  };
};
