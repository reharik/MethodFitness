module.exports = function(invariant) {
  return function({
    clientId,
    source,
    sourceNotes,
    startDate,
                    createdDate,
                    createdById
  }) {
    invariant(clientId, 'clientSourceUpdated requires that you pass the clients id');
    return {
      eventName: 'clientSourceUpdated',
      clientId,
      source,
      sourceNotes,
      startDate,
      createdDate,
      createdById
    };
  };
};
