module.exports = function() {
  return function({
    appointmentId,
    locationId,
    appointmentType,
    appointmentDate,
    startTime,
    endTime,
    trainerId,
    clients,
    notes,
    entityName,
    createdDate,
    createdById,
  }) {
    return {
      eventName: 'appointmentUpdated',
      appointmentId,
      locationId,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
      trainerId,
      clients,
      notes,
      entityName,
      createdDate,
      createdById,
    };
  };
};
