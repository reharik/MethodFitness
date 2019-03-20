module.exports = function() {
  return function({
    appointmentId,
    trainerId,
    appointmentType,
    clients,
    appointmentDate,
    startTime,
    endTime,
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
    };
  };
};
