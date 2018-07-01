module.exports = function(aggregateRootBase, dayCommands, dayEventHandlers) {
  return function day() {
    const state = {
      _isArchived: false,
      type: 'Day',
      appointments: [],
    };
    const aggFunctions = aggregateRootBase(state, dayEventHandlers);
    return Object.assign(
      {},
      aggFunctions,
      dayCommands(aggFunctions.raiseEvent, state),
      { state },
    );
  };
};
