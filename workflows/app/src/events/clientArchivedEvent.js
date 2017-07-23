module.exports = function(invariant) {
  return function({id,
                  archivedDate}) {
    invariant(id, 'clientArchived requires that you pass the clients id');
    invariant(archivedDate, 'clientArchived requires that you pass the date');
    return {
      eventName: 'clientArchived',
      id,
      archivedDate};
  };
};
