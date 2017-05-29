module.exports = function(eventDispatcher, CommandHandlers_array, eventReceiver, pingDB) {
  return async function() {
    if (!await pingDB()) {
      throw new Error('can not connect to the database');
    }
    let source = eventDispatcher().startDispatching('command');
    CommandHandlers_array.map(x => eventReceiver(source, x()));
  };
};
