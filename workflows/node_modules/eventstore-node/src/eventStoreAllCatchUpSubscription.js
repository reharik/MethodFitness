var util = require('util');

var EventStoreCatchUpSubscription = require('./eventStoreCatchUpSubscription');
var results = require('./results');


function EventStoreAllCatchUpSubscription(
    connection, log, fromPositionExclusive, resolveLinkTos, userCredentials,
    eventAppeared, liveProcessingStarted, subscriptionDropped,
    verboseLogging, readBatchSize
) {
  EventStoreCatchUpSubscription.call(this, connection, log, '', resolveLinkTos, userCredentials,
      eventAppeared, liveProcessingStarted, subscriptionDropped,
      verboseLogging, readBatchSize);

  this._lastProcessedPosition = fromPositionExclusive || new results.Position(-1,-1);
  this._nextReadPosition = fromPositionExclusive || new results.Position(0,0);
}
util.inherits(EventStoreAllCatchUpSubscription, EventStoreCatchUpSubscription);

EventStoreAllCatchUpSubscription.prototype._readEventsTill = function(
    connection, resolveLinkTos, userCredentials, lastCommitPosition, lastEventNumber
) {
  var self = this;

  function processEvents(events, index) {
    index = index || 0;
    if (index >= events.length) return Promise.resolve();
    if (events[index].originalPosition === null) throw new Error("Subscription event came up with no OriginalPosition.");

    return new Promise(function(resolve, reject) {
          self._tryProcess(events[index]);
          resolve();
        })
        .then(function() {
          return processEvents(events, index + 1);
        });
  }

  function readNext() {
    return connection.readAllEventsForward(self._nextReadPosition, self.readBatchSize, resolveLinkTos, userCredentials)
        .then(function(slice) {
          return processEvents(slice.events)
              .then(function() {
                self._nextReadPosition = slice.nextPosition;
                var done = lastCommitPosition === null
                    ? slice.isEndOfStream
                    : slice.nextPosition.compareTo(new results.Position(lastCommitPosition, lastCommitPosition)) >= 0;
                return Promise.resolve(done);
              });
        })
        .then(function(done) {
          if (done || self._shouldStop)
              return;
          return readNext();
        });
  }

  return readNext()
      .then(function() {
        if (self._verbose)
          self._log.debug("Catch-up Subscription to %s: finished reading events, nextReadPosition = %s.",
              self.isSubscribedToAll ? "<all>" : self.streamId, self._nextReadPosition);
      });
};


EventStoreAllCatchUpSubscription.prototype._tryProcess = function(e) {
  var processed = false;
  if (e.originalPosition.compareTo(this._lastProcessedPosition) > 0)
  {
    this._eventAppeared(this, e);
    this._lastProcessedPosition = e.originalPosition;
    processed = true;
  }
  if (this._verbose)
    this._log.debug("Catch-up Subscription to %s: %s event (%s, %d, %s @ %s).",
        this.streamId || '<all>', processed ? "processed" : "skipping",
        e.originalEvent.eventStreamId, e.originalEvent.eventNumber, e.originalEvent.eventType, e.originalPosition);
};

module.exports = EventStoreAllCatchUpSubscription;
