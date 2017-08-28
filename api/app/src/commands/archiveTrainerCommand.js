module.exports = function(invariant) {
  return function({trainerId}) {
    invariant(trainerId, 'archiveTrainer requires that you pass the trainerss id');
    return {trainerId};
  };
};
