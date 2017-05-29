module.exports = function(eventDispatcher,
                          EventHandlers_array,
                          EventHandlerClasses_array,
                          eventReceiver,
                          pingDB) {
  return async function() {
    if (!await pingDB()) {
      throw new Error('can not connect to the database');
    }
    let source = eventDispatcher().startDispatching('event');
    for ( let X of EventHandlerClasses_array) {
      let instance = new X();
      await instance.initialize();
      EventHandlers_array.push(instance);

    }
    EventHandlers_array.map(x => eventReceiver(source, typeof x === 'function' ? x() : x));
  };
};
