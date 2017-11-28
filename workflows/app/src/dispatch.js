// eslint-disable-next-line camelcase
module.exports = function(config, eventDispatcher, CommandHandlers_array, eventReceiver, pingDB) {
  return async function() {
    if (!await pingDB()) {
      throw new Error('can not connect to the database');
    }

    for (let x of CommandHandlers_array) { // eslint-disable-line camelcase
      let dispatcher = await eventDispatcher();
      let source = dispatcher.startDispatching('command');
      eventReceiver(source, x());
    }
  };
};
