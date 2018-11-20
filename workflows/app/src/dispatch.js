// eslint-disable-next-line camelcase
module.exports = function(
  config,
  eventDispatcher,
  CommandHandlers_array,
  eventReceiver,
  getStartPosition,
) {
  return async function() {
    try {
      for (let x of CommandHandlers_array) {
        // eslint-disable-line camelcase
        let handler = x();
        let position = await getStartPosition(handler.handlerName);
        let dispatcher = await eventDispatcher(position);
        let source = dispatcher.startDispatching('command');
        eventReceiver(source, handler);
      }
    } catch (er) {
      console.log(`=========="here?"==========`);
      console.log('here?');
      console.log(er);
      console.log(`==========END "here?"==========`);
    }
  };
};
