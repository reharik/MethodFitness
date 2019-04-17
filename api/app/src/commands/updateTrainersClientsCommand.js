module.exports = function(invariant) {
  return function({ trainerId, clients }) {
    invariant(
      trainerId,
      'updateTrainersClients requires that you pass the trainers id',
    );
    return {
      trainerId,
      clients,
    };
  };
};
