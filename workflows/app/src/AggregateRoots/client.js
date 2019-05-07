module.exports = function(
  aggregateRootBase,
  clientCommands,
  clientInventory,
  clientEventHandlers,
) {
  return function client() {
    const state = {
      _isArchived: false,
      type: 'Client',
      clientInventory: clientInventory(),
      unfundedAppointments: [],
      firstName: '',
      lastName: '',
      clientRates: {},
    };
    const aggFunctions = aggregateRootBase(state, clientEventHandlers);
    return Object.assign(
      {},
      aggFunctions,
      clientCommands(aggFunctions.raiseEvent, state),
      { state },
    );
  };
};
