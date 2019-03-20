module.exports = function(invariant) {
  return function({
                     trainerId,
                    defaultTrainerClientRate
                   }) {
    invariant(trainerId, 'updateDefaultTrainerClientRate requires that you pass the trainers id');
    invariant(defaultTrainerClientRate, 'updateDefaultTrainerClientRate requires that you pass the default rate');
    return {
      trainerId,
      defaultTrainerClientRate
    };
  };
};
