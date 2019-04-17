module.exports = function(invariant) {
  return function({ trainerId, clientRates }) {
    invariant(
      trainerId,
      'updateTrainersClients requires that you pass the trainers id',
    );
    clientRates.forEach(x =>
      invariant(
        x.clientId,
        'updateTrainersClients requires that you pass a client id for every client',
      ),
    );
    clientRates.forEach(x =>
      invariant(
        x.rate,
        'updateTrainersClients requires that you pass a client rate for every client',
      ),
    );
    return {
      trainerId,
      clientRates,
    };
  };
};
