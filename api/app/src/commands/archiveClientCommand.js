module.exports = function(invariant) {
  return function({clientId}) {
    invariant(clientId, 'archiveClient requires that you pass the clients id');
    return {clientId};
  };
};

