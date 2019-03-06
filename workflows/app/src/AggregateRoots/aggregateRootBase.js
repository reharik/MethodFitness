module.exports = function() { //logger) {
  return (state, eventHandlers) => {
    state._version = -1; // corresponds to ExpectedEvent.NoStream
    state.uncommittedEvents = [];
    const eventHandlersInstance = eventHandlers(state);
    const applyEvent = event => {
      // logger.debug(`${event.eventName} currently in applyEvent`);
      // logger.debug(JSON.stringify(event));

      if (eventHandlersInstance[event.eventName]) {
        eventHandlersInstance[event.eventName](event);
      }
      state._version++;
    };

    return {
      applyEvent,

      raiseEvent: event => {
        applyEvent(event);
        console.log(`==========raiseEvent==========`);
        console.log(event);
        console.log(`==========END raiseEvent==========`);

        state.uncommittedEvents.push(event);
      },

      getUncommittedEvents: () => {
        return state.uncommittedEvents;
      },

      clearUncommittedEvents: () => {
        state.uncommittedEvents = [];
      },

      isAggregateBase: () => {
        return true;
      },

      aggregateName: () => {
        return state.type;
      },

      debug: () => {
        return state;
      },
    };
  };
};
