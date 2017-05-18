var util = require('util');
var uuid = require('uuid');

var TcpCommand = require('../systemData/tcpCommand');
var InspectionDecision = require('../systemData/inspectionDecision');
var InspectionResult = require('./../systemData/inspectionResult');
var ClientMessage = require('../messages/clientMessage');
var results = require('../results');
var WrongExpectedVersionError = require('../errors/wrongExpectedVersionError');
var StreamDeletedError = require('../errors/streamDeletedError');
var AccessDeniedError = require('../errors/accessDeniedError');

var OperationBase = require('../clientOperations/operationBase');


function DeleteStreamOperation(log, cb, requireMaster, stream, expectedVersion, hardDelete, userCredentials) {
  OperationBase.call(this, log, cb, TcpCommand.DeleteStream, TcpCommand.DeleteStreamCompleted, userCredentials);
  this._responseType = ClientMessage.DeleteStreamCompleted;

  this._requireMaster = requireMaster;
  this._stream = stream;
  this._expectedVersion = expectedVersion;
  this._hardDelete = hardDelete;
}
util.inherits(DeleteStreamOperation, OperationBase);

DeleteStreamOperation.prototype._createRequestDto = function() {
  return new ClientMessage.DeleteStream(this._stream, this._expectedVersion, this._requireMaster, this._hardDelete);
};

DeleteStreamOperation.prototype._inspectResponse = function(response) {
  switch (response.result)
  {
    case ClientMessage.OperationResult.Success:
      this._succeed();
      return new InspectionResult(InspectionDecision.EndOperation, "Success");
    case ClientMessage.OperationResult.PrepareTimeout:
      return new InspectionResult(InspectionDecision.Retry, "PrepareTimeout");
    case ClientMessage.OperationResult.CommitTimeout:
      return new InspectionResult(InspectionDecision.Retry, "CommitTimeout");
    case ClientMessage.OperationResult.ForwardTimeout:
      return new InspectionResult(InspectionDecision.Retry, "ForwardTimeout");
    case ClientMessage.OperationResult.WrongExpectedVersion:
      this.fail(new WrongExpectedVersionError("Delete", this._stream, this._expectedVersion));
      return new InspectionResult(InspectionDecision.EndOperation, "WrongExpectedVersion");
    case ClientMessage.OperationResult.StreamDeleted:
      this.fail(new StreamDeletedError(this._stream));
      return new InspectionResult(InspectionDecision.EndOperation, "StreamDeleted");
    case ClientMessage.OperationResult.InvalidTransaction:
      this.fail(new Error("Invalid transaction."));
      return new InspectionResult(InspectionDecision.EndOperation, "InvalidTransaction");
    case ClientMessage.OperationResult.AccessDenied:
      this.fail(new AccessDeniedError("Delete", this._stream));
      return new InspectionResult(InspectionDecision.EndOperation, "AccessDenied");
    default:
      throw new Error(util.format("Unexpected OperationResult: %d.", response.result));
  }
};

DeleteStreamOperation.prototype._transformResponse = function(response) {
  return new results.DeleteResult(new results.Position(response.prepare_position || -1, response.commit_position || -1));
};

DeleteStreamOperation.prototype.toString = function() {
  return util.format("Stream: %s, ExpectedVersion: %s.", this._stream, this._expectedVersion);
};

module.exports = DeleteStreamOperation;