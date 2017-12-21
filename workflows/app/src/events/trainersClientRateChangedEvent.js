module.exports = function(invariant) {
  return function({
    trainerId,
    clients
  }) {
    invariant(trainerId, 'trainersClientRatesUpdated requires that you pass the trainers id');
    clients.forEach(x => invariant(x.clientId,
      'trainersClientRatesUpdated requires that you pass a client id for every client'));
    clients.forEach(x => invariant(
      x.rate,
      'trainersClientRatesUpdated requires that you pass a client rate for every client'));
    return {
      eventName: 'trainersClientRatesUpdated',
      trainerId,
      clients
    };
  };
};
