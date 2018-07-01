module.exports = function(invariant) {
  return function({ trainerId, date }) {
    invariant(trainerId, 'unArchiveTrainer requires that you pass the trainers id');
    invariant(date, 'unArchiveTrainer requires that you pass the date');
    return { trainerId, date };
  };
};
