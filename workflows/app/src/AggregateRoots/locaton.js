module.exports = function(
  aggregateRootBase,
  locationCommands,
  locationInventory,
  locationEventHandlers,
) {
  return function location() {
    const state = {
      _isArchived: false,
      type: 'Location',
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
