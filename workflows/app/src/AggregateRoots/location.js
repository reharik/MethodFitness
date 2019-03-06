module.exports = function(
  aggregateRootBase,
  locationCommands,
  locationEventHandlers,
) {
  return function location() {
    const state = {
      _isArchived: false,
      type: 'Location',
      name: '',
    };
    const aggFunctions = aggregateRootBase(state, locationEventHandlers);
    return Object.assign(
      {},
      aggFunctions,
      locationCommands(aggFunctions.raiseEvent, state),
      { state },
    );
  };
};
