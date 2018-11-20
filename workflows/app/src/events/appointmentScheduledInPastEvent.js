module.exports = function() {
  return function({
    appointmentId,
    locationId,
    appointmentType,
    date,
    startTime,
    endTime,
    trainerId,
    color,
    clients,
    notes,
    entityName,
  }) {
    return {
      eventName: 'appointmentScheduledInPast',
      appointmentId,
      locationId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      color,
      clients,
      notes,
      entityName,
    };
  };
};
