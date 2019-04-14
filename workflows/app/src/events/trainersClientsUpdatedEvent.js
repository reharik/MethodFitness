module.exports = function(invariant) {
  return function({
    trainerId,
    clients,
                    createdDate,
                    createdById
  }) {
    invariant(trainerId, 'trainersClientsUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainersClientsUpdated',
      trainerId,
      clients,
      createdDate,
      createdById
    };
  };
};
