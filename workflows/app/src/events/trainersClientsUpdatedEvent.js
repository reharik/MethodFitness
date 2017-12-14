module.exports = function(invariant) {
  return function({
    trainerId,
    clients
  }) {
    invariant(trainerId, 'trainersClientsUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainersClientsUpdated',
      trainerId,
      clients
    };
  };
};
