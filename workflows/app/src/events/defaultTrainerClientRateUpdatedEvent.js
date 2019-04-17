module.exports = function() {
  return function({
    trainerId,
    defaultTrainerClientRate,
    createdDate,
    createdById,
  }) {
    return {
      eventName: 'defaultTrainerClientRateUpdatedEvent',
      trainerId,
      defaultTrainerClientRate,
      createdDate,
      createdById,
    };
  };
};
