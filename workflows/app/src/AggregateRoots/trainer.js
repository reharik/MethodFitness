module.exports = function(
  aggregateRootBase,
  trainerCommands,
  trainerEventHandlers,
) {
  return function trainer() {
    const state = {
      _isArchived: false,
      type: 'Trainer',
      trainerClients: [],
      _password: undefined,
      _defaultTrainerCientRate: 65,
      trainerClientRates: [],
      firstName,
      lastName,
    };
    const aggFunctions = aggregateRootBase(state, trainerEventHandlers);
    return Object.assign(
      {},
      aggFunctions,
      trainerCommands(aggFunctions.raiseEvent, state),
      { state },
    );
  };
};
