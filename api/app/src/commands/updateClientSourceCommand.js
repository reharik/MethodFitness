module.exports = function(invariant) {
  return function ({
    id,
    source,
    sourceNotes,
    startDate
  }) {
    invariant(id, 'updateClientSource requires that you pass the clients id');
    return {
      id,
      source,
      sourceNotes,
      startDate
    }
  };
};