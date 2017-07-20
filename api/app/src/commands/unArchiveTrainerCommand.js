module.exports = function(invariant) {
  return function({ id }) {
    invariant(id, 'unArchiveTrainer requires that you pass the trainers id');
    return { id };
  };
};
