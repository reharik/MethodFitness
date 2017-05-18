module.exports = function(invariant) {
  return function (data) {
    invariant(data.id, 'archiveTrainer requires that you pass the trainerss id');
    return {id: data.id}
  }
};