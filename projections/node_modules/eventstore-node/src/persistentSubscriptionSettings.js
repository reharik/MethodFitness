var SystemConsumerStrategies = require('./systemConsumerStrategies');

function PersistentSubscriptionSettings(
  resolveLinkTos, startFrom, extraStatistics, messageTimeout,
  maxRetryCount, liveBufferSize, readBatchSize, historyBufferSize,
  checkPointAfter, minCheckPointCount, maxCheckPointCount,
  maxSubscriberCount, namedConsumerStrategy
) {
  this.resolveLinkTos = resolveLinkTos;
  this.startFrom = startFrom;
  this.extraStatistics = extraStatistics;
  this.messageTimeout = messageTimeout;
  this.maxRetryCount = maxRetryCount;
  this.liveBufferSize = liveBufferSize;
  this.readBatchSize = readBatchSize;
  this.historyBufferSize = historyBufferSize;
  this.checkPointAfter = checkPointAfter;
  this.minCheckPointCount = minCheckPointCount;
  this.maxCheckPointCount = maxCheckPointCount;
  this.maxSubscriberCount = maxSubscriberCount;
  this.namedConsumerStrategy = namedConsumerStrategy;
}

PersistentSubscriptionSettings.create = function() {
  return new PersistentSubscriptionSettings(false, -1, false, 30000, 500, 500, 10, 20, 2000, 10, 1000, 0, SystemConsumerStrategies.RoundRobin);
};

module.exports = PersistentSubscriptionSettings;