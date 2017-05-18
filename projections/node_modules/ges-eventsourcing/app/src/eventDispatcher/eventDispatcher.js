var eventDispatcher = function eventDispatcher(eventstore,
                                               logger,
                                               rx,
                                               R,
                                               mapAndFilterStream) {
  return function () {
    return {
      startDispatching: function (streamType) {
        logger.info('startDispatching | startDispatching called');
        const eventAppeared = eventstore.eventEmitterInstance();
        var mAndF = mapAndFilterStream(streamType);

        var subscription = eventstore.gesConnection.subscribeToAllFrom(
          null,
          false,
          eventAppeared.emitEvent,
          eventstore.liveProcessingStarted,
          eventstore.subscriptionDropped,
          eventstore.credentials);

        logger.info("subscription.isSubscribedToAll: " + subscription.isSubscribedToAll);

        return rx.Observable.fromEvent(eventAppeared.emitter, 'event')
          .filter(mAndF.isValidStreamType)
          .map(mAndF.transformEvent)
          .share();
      }
    }
  };
};
module.exports = eventDispatcher;
