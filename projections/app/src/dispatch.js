module.exports = function(
  eventDispatcher,
  EventHandlers_array, //eslint-disable-line camelcase
  eventReceiver,
  getStartPosition,
  logger,
) {
  return async function() {
    try {
      for (let _x of EventHandlers_array) {
        //eslint-disable-line camelcase
        let x = await _x();
        const position = await getStartPosition(x.handlerName);
        let dispatcher = await eventDispatcher(position);
        let source = dispatcher.startDispatching('event');
        eventReceiver(source, x);
      }
    } catch (ex) {
      logger.error(ex);
    }
  };
};
