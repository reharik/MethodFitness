module.exports = function(invariant) {
  return function({
                    id,
                    source,
                    sourceNotes,
                    startDate
                  }) {
    invariant(id, 'clientSourceUpdated requires that you pass the clients id');
    return {
      eventName: 'clientSourceUpdated',
      id,
      source,
      sourceNotes,
      startDate
    };
  };
};
