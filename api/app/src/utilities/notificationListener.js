module.exports = function(logger, eventstore, rx, applicationFunctions, mapAndFilterStream) {
  return continuationId => {
    logger.info('startDispatching | startDispatching called');
    const eventAppeared = eventstore.eventEmitterInstance();
    let mAndF = mapAndFilterStream();
    let ef = applicationFunctions.eventFunctions;
    let subscription = eventstore.gesConnection.subscribeToStream(
      'notification',
      false,
      eventAppeared.emitEvent,
      null,
      eventstore.credentials
    );

    logger.info('subscription.isSubscribedToAll: ' + subscription.isSubscribedToAll);

    let stream = rx.Observable
      .fromEvent(eventAppeared.emitter, 'event')
      .first(
        note =>
        mAndF.continuationId(note).getOrElse() === continuationId &&
        ef.parseData(note).getOrElse().initialEvent.metadata.streamType === 'command'
      )
      .map(note => ef.parseData(note).getOrElse())
      .toPromise();

    return {
      stream,
      subscription
    };
  };
};
