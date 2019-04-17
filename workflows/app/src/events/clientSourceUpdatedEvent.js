module.exports = function(invariant) {
  return function({ clientId, source, sourceNotes, startDate }) {
    invariant(
      clientId,
      'clientSourceUpdated requires that you pass the clients id',
    );
    return {
      eventName: 'clientSourceUpdated',
      clientId,
      source,
      sourceNotes,
      startDate,
    };
  };
};
