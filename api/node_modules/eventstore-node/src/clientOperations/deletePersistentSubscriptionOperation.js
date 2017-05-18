var util = require('util');
var uuid = require('uuid');

var ensure = require('../common/utils/ensure');
var OperationBase = require('../clientOperations/operationBase');
var TcpCommand = require('../systemData/tcpCommand');
var ClientMessage = require('../messages/clientMessage');
var InspectionDecision = require('../systemData/inspectionDecision');
var InspectionResult = require('./../systemData/inspectionResult');
var results = require('../results');


function DeletePersistentSubscriptionOperation(log, cb, stream, groupName, userCredentials) {
  OperationBase.call(this, log, cb, TcpCommand.DeletePersistentSubscription, TcpCommand.DeletePersistentSubscriptionCompleted, userCredentials);

  this._stream = stream;
  this._groupName = groupName;

  this._responseType = ClientMessage.DeletePersistentSubscriptionCompleted;
}
util.inherits(DeletePersistentSubscriptionOperation, OperationBase);

DeletePersistentSubscriptionOperation.prototype._createRequestDto = function() {
  return new ClientMessage.DeletePersistentSubscription(this._groupName, this._stream);
};

DeletePersistentSubscriptionOperation.prototype._inspectResponse = function(response) {
  switch (response.result)
  {
    case ClientMessage.DeletePersistentSubscriptionCompleted.DeletePersistentSubscriptionResult.Success:
      this._succeed();
      return new InspectionResult(InspectionDecision.EndOperation, "Success");
    case ClientMessage.DeletePersistentSubscriptionCompleted.DeletePersistentSubscriptionResult.Fail:
      this.fail(new Error(util.format("Subscription group %s on stream %s failed '%s'", this._groupName, this._stream, response.reason)));
      return new InspectionResult(InspectionDecision.EndOperation, "Fail");
    case ClientMessage.DeletePersistentSubscriptionCompleted.DeletePersistentSubscriptionResult.AccessDenied:
      this.fail(new Error(util.format("Write access denied for stream '%s'.", this._stream)));
      return new InspectionResult(InspectionDecision.EndOperation, "AccessDenied");
    case ClientMessage.DeletePersistentSubscriptionCompleted.DeletePersistentSubscriptionResult.DoesNotExist:
      this.fail(new Error(util.format("Subscription group %s on stream %s does not exist", this._groupName, this._stream)));
      return new InspectionResult(InspectionDecision.EndOperation, "DoesNotExist");
    default:
      throw new Error(util.format("Unexpected OperationResult: %s.", response.result));
  }
};

DeletePersistentSubscriptionOperation.prototype._transformResponse = function(response) {
  return new results.PersistentSubscriptionDeleteResult(results.PersistentSubscriptionDeleteStatus.Success);
};

DeletePersistentSubscriptionOperation.prototype.toString = function() {
  return util.format("Stream: %s, Group Name: %s", this._stream, this._groupName);
};

module.exports = DeletePersistentSubscriptionOperation;
