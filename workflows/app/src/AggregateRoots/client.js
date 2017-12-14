module.exports = function(aggregateRootBase,
  clientCommands,
  ClientInventory,
  clientEventHandlers) {
  return function client() {
    const state = {
      _isArchived: false,
      type: 'Client',
      clientInventory: new ClientInventory(),
      unfundedAppointments: []
    };
    const aggFunctions = aggregateRootBase(state, clientEventHandlers);
    return Object.assign({},
      aggFunctions, clientCommands(aggFunctions.raiseEvent, state),
      {state});
  };
};
