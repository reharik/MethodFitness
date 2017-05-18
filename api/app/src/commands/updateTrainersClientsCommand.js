module.exports = function(invariant) {
  return function ({
    id,
    clients
  }) {
    invariant(id, 'updateTrainersClients requires that you pass the trainers id');
    return {
      id,
      clients
    }
  };
};