module.exports = function(invariant) {
  return function({
                    id,
                    clients
                  }) {
    invariant(id, 'trainersClientsUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainersClientsUpdated',
      id,
      clients
    };
  };
};
