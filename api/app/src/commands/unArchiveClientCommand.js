module.exports = function(invariant) {
  return function({ clientId }) {
    invariant(clientId, 'unArchiveClient requires that you pass the clients id');
    return { clientId };
  };
};
