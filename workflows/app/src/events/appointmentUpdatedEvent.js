module.exports = function() {
  return function({
    appointmentId,
    locationId,
    appointmentType,
    date,
    startTime,
    endTime,
    trainerId,
    clients,
    notes,
    entityName,
  }) {
    return {
      eventName: 'appointmentUpdated',
      appointmentId,
      locationId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      clients,
      notes,
      entityName,
    };
  };
};
