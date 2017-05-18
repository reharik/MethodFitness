module.exports = function(invariant) {
  return function (data) {
    invariant(data.id, 'unArchiveTrainer requires that you pass the trainers id');
    return {id: data.id}
  }
};