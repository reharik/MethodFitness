/***
 * EventStoreSubscription
 * @param {string} streamId
 * @param {number} lastCommitPosition
 * @param {?number} lastEventNumber
 * @constructor
 * @property {boolean} isSubscribedToAll
 * @property {string} streamId
 * @property {number} lastCommitPosition
 * @property {?number} lastEventNumber
 */
function EventStoreSubscription(streamId, lastCommitPosition, lastEventNumber) {
  Object.defineProperties(this, {
    isSubscribedToAll: {
      value: streamId === ''
    },
    streamId: {
      value: streamId
    },
    lastCommitPosition: {
      value: lastCommitPosition
    },
    lastEventNumber: {
      value: lastEventNumber
    }
  });
}

/**
 * Unsubscribes from the stream
 */
EventStoreSubscription.prototype.close = function() {
  this.unsubscribe();
};

/**
 * Unsubscribes from the stream
 * @abstract
 */
EventStoreSubscription.prototype.unsubscribe = function() {
  throw new Error("EventStoreSubscription.unsubscribe abstract method called." + this.constructor.name);
};

module.exports = EventStoreSubscription;
