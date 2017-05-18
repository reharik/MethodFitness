var util = require('util');

var EventStoreSubsription = require('./eventStoreSubscription');

/**
 * @private
 * @param {SubscriptionOperation} subscriptionOperation
 * @param {string} streamId
 * @param {Position} lastCommitPosition
 * @param {number} lastEventNumber
 * @constructor
 * @augments {EventStoreSubscription}
 */
function VolatileEventStoreSubscription(subscriptionOperation, streamId, lastCommitPosition, lastEventNumber) {
  EventStoreSubsription.call(this, streamId, lastCommitPosition, lastEventNumber);

  this._subscriptionOperation = subscriptionOperation;
}
util.inherits(VolatileEventStoreSubscription, EventStoreSubsription);

VolatileEventStoreSubscription.prototype.unsubscribe = function() {
  this._subscriptionOperation.unsubscribe();
};

module.exports = VolatileEventStoreSubscription;
