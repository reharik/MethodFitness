module.exports = function() {
  return function({
    appointmentId,
    locationId,
    locationName,
    appointmentType,
    appointmentDate,
    startTime,
    endTime,
    trainerId,
    trainerFirstName,
    trainerLastName,
    color,
    clients,
    notes,
    entityName,
                    createdDate,
    createdById,
                    //TODO remove after migration
                    legacyId,
    migration,
    lateCancellation,
  }) {
    return {
      eventName: 'appointmentScheduledInPast',
      appointmentId,
      locationId,
      locationName,
      appointmentType,
      appointmentDate,
      startTime,
      endTime,
      trainerId,
      trainerFirstName,
      trainerLastName,
      color,
      clients,
      notes,
      entityName,
      createdDate,
      createdById,
      //TODO remove after migration
      migration,
      legacyId,
      lateCancellation,
    };
  };
};
