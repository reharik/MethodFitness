module.exports = function(invariant) {
  return function({
                     id,
                    clientRates
                   }) {
    invariant(id, 'updateTrainersClients requires that you pass the trainers id');
    clientRates.forEach(x => invariant(x.id,
      'updateTrainersClients requires that you pass a client id for every client'));
    clientRates.forEach(x => invariant(
      x.rate,
      'updateTrainersClients requires that you pass a client rate for every client'));
    return {
      id,
      clientRates
    };
  };
};
