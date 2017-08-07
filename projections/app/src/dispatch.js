module.exports = function(eventDispatcher,
                          EventHandlers_array,
                          eventReceiver,
                          pingDB) {
  return async function() {
    if (!await pingDB()) {
      throw new Error('can not connect to the database');
    }
    let dispatcher = await eventDispatcher();
    let source = dispatcher.startDispatching('event');

    for ( let _x of EventHandlers_array) {
      let x = await _x();
      eventReceiver(source, x);
    }
  };
};
