var util = require('util');
var uuid = require('uuid');
var Hash = require('../common/hash');

var SubscriptionDropReason = require('../subscriptionDropReason');

function SubscriptionsManager(connectionName, settings) {
  //Ensure.NotNull(connectionName, "connectionName");
  //Ensure.NotNull(settings, "settings");
  this._connectionName = connectionName;
  this._settings = settings;

  this._activeSubscriptions = new Hash();
  this._waitingSubscriptions = [];
  this._retryPendingSubscriptions = [];
}

SubscriptionsManager.prototype.getActiveSubscription = function(correlationId) {
  return this._activeSubscriptions.get(correlationId);
};

SubscriptionsManager.prototype.cleanUp = function() {
  var connectionClosedError = new Error(util.format("Connection '%s' was closed.", this._connectionName));

  var self = this;
  this._activeSubscriptions.forEach(function(correlationId, subscription){
    subscription.operation.dropSubscription(SubscriptionDropReason.ConnectionClosed, connectionClosedError);
  });
  this._waitingSubscriptions.forEach(function(subscription){
    subscription.operation.dropSubscription(SubscriptionDropReason.ConnectionClosed, connectionClosedError);
  });
  this._retryPendingSubscriptions.forEach(function(subscription){
    subscription.operation.dropSubscription(SubscriptionDropReason.ConnectionClosed, connectionClosedError);
  });

  this._activeSubscriptions.clear();
  this._waitingSubscriptions = [];
  this._retryPendingSubscriptions = [];
};

SubscriptionsManager.prototype.purgeSubscribedAndDroppedSubscriptions = function(connectionId) {
  var self = this;
  var subscriptionsToRemove = [];
  this._activeSubscriptions.forEach(function(_, subscription) {
    if (subscription.isSubscribed && subscription.connectionId === connectionId) {
      subscription.operation.connectionClosed();
      subscriptionsToRemove.push(subscription);
    }
  });
  subscriptionsToRemove.forEach(function(subscription) {
    self._activeSubscriptions.remove(subscription.correlationId);
  });
};

SubscriptionsManager.prototype.checkTimeoutsAndRetry = function(connection) {
  //Ensure.NotNull(connection, "connection");

  var self = this;
  var retrySubscriptions = [];
  var removeSubscriptions = [];
  this._activeSubscriptions.forEach(function(_, subscription) {
    if (subscription.isSubscribed) return;
    if (subscription.connectionId !== connection.connectionId)
    {
      retrySubscriptions.push(subscription);
    }
    else if (subscription.timeout > 0 && Date.now() - subscription.lastUpdated > self._settings.operationTimeout)
    {
      var err = util.format("EventStoreConnection '%s': subscription never got confirmation from server.\n" +
          "UTC now: %s, operation: %s.",
          self._connectionName, new Date(), subscription);
      self._settings.log.error(err);

      if (self._settings.failOnNoServerResponse)
      {
        subscription.operation.dropSubscription(SubscriptionDropReason.SubscribingError, new Error(err));
        removeSubscriptions.push(subscription);
      }
      else
      {
        retrySubscriptions.push(subscription);
      }
    }
  });

  retrySubscriptions.forEach(function(subscription) {
    self.scheduleSubscriptionRetry(subscription);
  });
  removeSubscriptions.forEach(function(subscription) {
    self.removeSubscription(subscription);
  });

  if (this._retryPendingSubscriptions.length > 0)
  {
    this._retryPendingSubscriptions.forEach(function(subscription) {
      subscription.retryCount += 1;
      self.startSubscription(subscription, connection);
    });
    this._retryPendingSubscriptions = [];
  }

  while (this._waitingSubscriptions.length > 0)
  {
    this.startSubscription(this._waitingSubscriptions.shift(), connection);
  }
};

SubscriptionsManager.prototype.removeSubscription = function(subscription) {
  this._activeSubscriptions.remove(subscription.correlationId);
  this._logDebug("RemoveSubscription %s.", subscription);
  return true;
};

SubscriptionsManager.prototype.scheduleSubscriptionRetry = function(subscription) {
  if (!this.removeSubscription(subscription))
  {
    this._logDebug("RemoveSubscription failed when trying to retry %s.", subscription);
    return;
  }

  if (subscription.maxRetries >= 0 && subscription.retryCount >= subscription.maxRetries)
  {
    this._logDebug("RETRIES LIMIT REACHED when trying to retry %s.", subscription);
    var err = util.format("Retries limit reached. Subscription: %s RetryCount: %d.", subscription, subscription.retryCount);
    subscription.operation.dropSubscription(SubscriptionDropReason.SubscribingError, new Error(err));
    return;
  }

  this._logDebug("retrying subscription %s.", subscription);
  this._retryPendingSubscriptions.push(subscription);
};

SubscriptionsManager.prototype.enqueueSubscription = function(subscriptionItem) {
  this._waitingSubscriptions.push(subscriptionItem);
};

SubscriptionsManager.prototype.startSubscription = function(subscription, connection) {
  //Ensure.NotNull(connection, "connection");

  if (subscription.isSubscribed)
  {
    this._logDebug("StartSubscription REMOVING due to already subscribed %s.", subscription);
    this.removeSubscription(subscription);
    return;
  }

  subscription.correlationId = uuid.v4();
  subscription.connectionId = connection.connectionId;
  subscription.lastUpdated = Date.now();

  this._activeSubscriptions.add(subscription.correlationId, subscription);

  if (!subscription.operation.subscribe(subscription.correlationId, connection))
  {
    this._logDebug("StartSubscription REMOVING AS COULDN'T SUBSCRIBE %s.", subscription);
    this.removeSubscription(subscription);
  }
  else
  {
    this._logDebug("StartSubscription SUBSCRIBING %s.", subscription);
  }
};

SubscriptionsManager.prototype._logDebug = function(message) {
  if (!this._settings.verboseLogging) return;

  var parameters = Array.prototype.slice.call(arguments, 1);
  this._settings.log.debug("EventStoreConnection '%s': %s.", this._connectionName, parameters.length === 0 ? message : util.format(message, parameters));
};

module.exports = SubscriptionsManager;