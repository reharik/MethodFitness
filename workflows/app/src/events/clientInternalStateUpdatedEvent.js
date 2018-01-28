module.exports = function() {
  return function({
    appointmentId,
    trainerId,
    appointmentType,
    clients,
    date,
    startTime,
    endTime
  }) {
    return {
      eventName: 'clientInternalStateUpdated',
      appointmentId,
      trainerId,
      appointmentType,
      clients,
      date,
      startTime,
      endTime
    };
  };
};
