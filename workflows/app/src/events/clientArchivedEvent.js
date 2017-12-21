module.exports = function(invariant) {
  return function({clientId,
    archivedDate}) {
    invariant(clientId, 'clientArchived requires that you pass the clients id');
    invariant(archivedDate, 'clientArchived requires that you pass the date');
    return {
      eventName: 'clientArchived',
      clientId,
      archivedDate};
  };
};
