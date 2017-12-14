module.exports = function(eventDispatcher,
                          EventHandlers_array,
                          eventReceiver,
                          pingDB,
                          logger) {
  return async function() {
    if (!await pingDB()) {
      throw new Error('can not connect to the database');
    }
    try {
      for (let _x of EventHandlers_array) { //eslint-disable-line camelcase
        let x = await _x();
        let dispatcher = await eventDispatcher();
        let source = dispatcher.startDispatching('event');
        eventReceiver(source, x);
      }
    } catch (ex) {
      logger.error(ex);
    }
  };
};
