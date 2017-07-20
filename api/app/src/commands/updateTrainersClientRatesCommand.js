module.exports = function(invariant) {
  return function({
                     id,
                     clients
                   }) {
    invariant(id, 'updateTrainersClients requires that you pass the trainers id');
    clients.forEach(x => invariant(x.id, 'updateTrainersClients requires that you pass a client id for every client'));
    clients.forEach(x => invariant(
      x.rate,
      'updateTrainersClients requires that you pass a client rate for every client'));
    return {
      id,
      clients
    };
  };
};
