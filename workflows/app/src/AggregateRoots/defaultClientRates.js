module.exports = function(
  aggregateRootBase,
  defaultClientRatesCommands,
  defaultClientRatesEventHandlers,
) {
  return function defaultClientRates() {
    const state = {
      type: 'DefaultClientRates',
      name: '',
    };
    const aggFunctions = aggregateRootBase(
      state,
      defaultClientRatesEventHandlers,
    );
    return Object.assign(
      {},
      aggFunctions,
      defaultClientRatesCommands(aggFunctions.raiseEvent, state),
      { state },
    );
  };
};
