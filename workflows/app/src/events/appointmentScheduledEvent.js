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
      eventName: 'appointmentScheduled',
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
