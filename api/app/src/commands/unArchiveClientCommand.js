module.exports = function(invariant) {
  return function({ clientId, date }) {
    invariant(clientId, 'unArchiveClient requires that you pass the clients id');
    invariant(date, 'unArchiveClient requires that you pass the date');
    return { clientId, date };
  };
};
