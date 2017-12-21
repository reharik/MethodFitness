module.exports = function() {
  return function({
    trainerId,
    clientId,
    rate
  }) {
    return {
      eventName: 'trainersNewClientRateSet',
      trainerId,
      clientId,
      rate
    };
  };
};
