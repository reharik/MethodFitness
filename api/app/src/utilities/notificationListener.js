module.exports = function(logger, eventstore, rx, applicationFunctions, mapAndFilterStream) {
  return async continuationId => {
    logger.info('startDispatching | startDispatching called');
    const eventAppeared = eventstore.eventEmitterInstance();
    let mAndF = mapAndFilterStream();
    let ef = applicationFunctions.eventFunctions;

    const connection = await eventstore.gesConnection;
    console.log(`==========connection=========`);
    console.log(connection);
    console.log(`==========END connection=========`);
    let subscription = connection.subscribeToStream(
      'notification',
      false,
      eventAppeared.emitEvent,
      eventstore.subscriptionDropped,
      // subscriptionDropped,
      eventstore.credentials
    );
    logger.info('subscription.isSubscribedToAll: ' + subscription.isSubscribedToAll);

    let stream = rx.Observable
      .fromEvent(eventAppeared.emitter, 'event')
      .first(
        note => {
          return mAndF.continuationId(note).getOrElse() === continuationId &&
          ef.parseData(note).getOrElse().initialEvent.metadata.streamType === 'command';
        })
      .map(note => ef.parseData(note).getOrElse())
      .toPromise();

    return {
      stream,
      subscription
    };
  };
};
