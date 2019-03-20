module.exports = function() {
  return function({
    trainerId, defaultTrainerClientRate
  }) {
    return {
      eventName: 'defaultTrainerClientRateUpdatedEvent',
      trainerId,
      defaultTrainerClientRate
    };
  };
};
