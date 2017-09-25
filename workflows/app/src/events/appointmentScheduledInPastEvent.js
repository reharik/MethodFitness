module.exports = function() {
  return function({
                     appointmentId,
                     appointmentType,
                     date,
                     startTime,
                     endTime,
                    trainerId,
                    color,
                     clients,
                     notes,
                     entityName
                   }) {
    return {
      eventName: 'appointmentScheduledInPast',
      appointmentId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      color,
      clients,
      notes,
      entityName
    };
  };
};
