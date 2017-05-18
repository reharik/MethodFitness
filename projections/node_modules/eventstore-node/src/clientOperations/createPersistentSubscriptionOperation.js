var util = require('util');
var uuid = require('uuid');

var ensure = require('../common/utils/ensure');
var OperationBase = require('../clientOperations/operationBase');
var TcpCommand = require('../systemData/tcpCommand');
var ClientMessage = require('../messages/clientMessage');
var SystemConsumerStrategies = require('../systemConsumerStrategies');
var InspectionDecision = require('../systemData/inspectionDecision');
var InspectionResult = require('./../systemData/inspectionResult');
var results = require('../results');


function CreatePersistentSubscriptionOperation(log, cb, stream, groupName, settings, userCredentials) {
  OperationBase.call(this, log, cb, TcpCommand.CreatePersistentSubscription, TcpCommand.CreatePersistentSubscriptionCompleted, userCredentials);

  ensure.notNull(settings, "settings");
  this._resolveLinkTos = settings.resolveLinkTos;
  this._stream = stream;
  this._groupName = groupName;
  this._startFromBeginning = settings.startFrom;
  this._maxRetryCount = settings.maxRetryCount;
  this._liveBufferSize = settings.liveBufferSize;
  this._readBatchSize = settings.readBatchSize;
  this._bufferSize = settings.historyBufferSize;
  this._recordStatistics = settings.extraStatistics;
  this._messageTimeoutMilliseconds = settings.messageTimeout;
  this._checkPointAfter = settings.checkPointAfter;
  this._minCheckPointCount = settings.minCheckPointCount;
  this._maxCheckPointCount = settings.maxCheckPointCount;
  this._maxSubscriberCount = settings.maxSubscriberCount;
  this._namedConsumerStrategy = settings.namedConsumerStrategy;

  this._responseType = ClientMessage.CreatePersistentSubscriptionCompleted;
}
util.inherits(CreatePersistentSubscriptionOperation, OperationBase);

CreatePersistentSubscriptionOperation.prototype._createRequestDto = function() {
  return new ClientMessage.CreatePersistentSubscription(this._groupName, this._stream, this._resolveLinkTos,
      this._startFromBeginning, this._messageTimeoutMilliseconds, this._recordStatistics, this._liveBufferSize,
      this._readBatchSize, this._bufferSize, this._maxRetryCount,
      this._namedConsumerStrategy === SystemConsumerStrategies.RoundRobin, this._checkPointAfter,
      this._maxCheckPointCount, this._minCheckPointCount, this._maxSubscriberCount, this._namedConsumerStrategy);
};

CreatePersistentSubscriptionOperation.prototype._inspectResponse = function(response) {
  switch (response.result)
  {
    case ClientMessage.CreatePersistentSubscriptionCompleted.CreatePersistentSubscriptionResult.Success:
      this._succeed();
      return new InspectionResult(InspectionDecision.EndOperation, "Success");
    case ClientMessage.CreatePersistentSubscriptionCompleted.CreatePersistentSubscriptionResult.Fail:
      this.fail(new Error(util.format("Subscription group %s on stream %s failed '%s'", this._groupName, this._stream, response.reason)));
      return new InspectionResult(InspectionDecision.EndOperation, "Fail");
    case ClientMessage.CreatePersistentSubscriptionCompleted.CreatePersistentSubscriptionResult.AccessDenied:
      this.fail(new Error(util.format("Write access denied for stream '%s'.", this._stream)));
      return new InspectionResult(InspectionDecision.EndOperation, "AccessDenied");
    case ClientMessage.CreatePersistentSubscriptionCompleted.CreatePersistentSubscriptionResult.AlreadyExists:
      this.fail(new Error(util.format("Subscription group %s on stream %s already exists", this._groupName, this._stream)));
      return new InspectionResult(InspectionDecision.EndOperation, "AlreadyExists");
    default:
      throw new Error(util.format("Unexpected OperationResult: %s.", response.result));
  }
};

CreatePersistentSubscriptionOperation.prototype._transformResponse = function(response) {
  return new results.PersistentSubscriptionCreateResult(results.PersistentSubscriptionCreateStatus.Success);
};

CreatePersistentSubscriptionOperation.prototype.toString = function() {
  return util.format("Stream: %s, Group Name: %s", this._stream, this._groupName);
};

module.exports = CreatePersistentSubscriptionOperation;
