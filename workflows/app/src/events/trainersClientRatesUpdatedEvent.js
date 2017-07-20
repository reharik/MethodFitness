module.exports = function() {
  return function({
                    trainerId,
                    clientId,
                    rate
                  }) {
    return {
      eventName: 'trainersClientRateChanged',
      trainerId,
      clientId,
      rate
    };
  };
};
