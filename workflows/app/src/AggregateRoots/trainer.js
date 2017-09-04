module.exports = function(aggregateRootBase,
                              trainerCommands,
                              ClientInventory,
                              trainerEventHandlers) {
  return function trainer() {
    const state = {
      _isArchived: false,
      type: 'Trainer',
      trainerClients: [],
      _password: undefined,
      _defaultTrainerCientRate: 65,
      trainerClientRates: []
    };
    const aggFunctions = aggregateRootBase(state, trainerEventHandlers);
    return Object.assign({},
      aggFunctions, trainerCommands(aggFunctions.raiseEvent, state),
      {state});
  };
};
