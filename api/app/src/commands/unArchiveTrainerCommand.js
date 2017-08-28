module.exports = function(invariant) {
  return function({ trainerId }) {
    invariant(trainerId, 'unArchiveTrainer requires that you pass the trainers id');
    return { trainerId };
  };
};
