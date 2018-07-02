module.exports = function(invariant) {
  return function({ clientId, date }) {
    invariant(clientId, 'archiveClient requires that you pass the clients id');
    invariant(date, 'archiveClient requires that you pass the date');
    return { clientId, date };
  };
};
