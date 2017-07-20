module.exports = function() {
  return function({
                     appointmentId,
                     appointmentType,
                     date,
                     startTime,
                     endTime,
                     trainerId,
                     clients,
                     notes,
                     entityName
                   }) {
    return {
      eventName: 'appointmentUpdated',
      id: appointmentId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      clients,
      notes,
      entityName
    };
  };
};
