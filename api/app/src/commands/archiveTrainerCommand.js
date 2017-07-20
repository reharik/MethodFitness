module.exports = function(invariant) {
  return function({id}) {
    invariant(id, 'archiveTrainer requires that you pass the trainerss id');
    return {id};
  };
};
