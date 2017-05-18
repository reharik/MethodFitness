var util = require('util');

var EventStorePersistentSubscriptionBase = require('./eventStorePersistentSubscriptionBase');
var messages = require('./core/messages');

function EventStorePersistentSubscription(
    subscriptionId, streamId, eventAppeared, subscriptionDropped, userCredentials, log, verboseLogging, settings,
    handler, bufferSize, autoAck
) {
  bufferSize = bufferSize === undefined ? 10 : bufferSize;
  autoAck = autoAck === undefined ? true : !!autoAck;

  EventStorePersistentSubscriptionBase.call(this, subscriptionId, streamId, eventAppeared, subscriptionDropped,
                                            userCredentials, log, verboseLogging, settings, bufferSize, autoAck);

  this._handler = handler;
}
util.inherits(EventStorePersistentSubscription, EventStorePersistentSubscriptionBase);

EventStorePersistentSubscription.prototype._startSubscription = function(
    subscriptionId, streamId, bufferSize, userCredentials, onEventAppeared, onSubscriptionDropped, settings
) {
  var self = this;
  return new Promise(function(resolve, reject){
    function cb(err, result) {
      if (err) return reject(err);
      resolve(result);
    }
    self._handler.enqueueMessage(new messages.StartPersistentSubscriptionMessage(cb, subscriptionId, streamId,
        bufferSize, userCredentials, onEventAppeared, onSubscriptionDropped, settings.maxRetries,
        settings.operationTimeout));
  });
};

module.exports = EventStorePersistentSubscription;