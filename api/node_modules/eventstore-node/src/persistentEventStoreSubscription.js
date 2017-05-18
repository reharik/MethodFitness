var util = require('util');

var EventStoreSubscription = require('./eventStoreSubscription');


function PersistentEventStoreSubscription(subscriptionOperation, streamId, lastCommitPosition, lastEventNumber) {
  EventStoreSubscription.call(this, streamId, lastCommitPosition, lastEventNumber);

  this._subscriptionOperation = subscriptionOperation;
}
util.inherits(PersistentEventStoreSubscription, EventStoreSubscription);

PersistentEventStoreSubscription.prototype.unsubscribe = function() {
  this._subscriptionOperation.unsubscribe();
};

PersistentEventStoreSubscription.prototype.notifyEventsProcessed = function(processedEvents) {
  this._subscriptionOperation.notifyEventsProcessed(processedEvents);
};

PersistentEventStoreSubscription.prototype.notifyEventsFailed = function(processedEvents, action, reason) {
  this._subscriptionOperation.notifyEventsFailed(processedEvents, action, reason);
};

module.exports = PersistentEventStoreSubscription;
