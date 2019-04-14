module.exports = function() {
  return function({
    appointmentId,
    trainerId,
    appointmentType,
    clients,
    appointmentDate,
    startTime,
    endTime,
                    createdDate,
                    createdById
  }) {
    return {
      eventName: 'clientInternalStateUpdated',
      appointmentId,
      trainerId,
      appointmentType,
      clients,
      appointmentDate,
      startTime,
      endTime,
      createdDate,
      createdById
    };
  };
};
