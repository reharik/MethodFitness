var util = require('util');
var ensure = require('../common/utils/ensure');

function Message() {
}
Message.prototype.toString = function() {
  return this.constructor.name;
};

function StartConnectionMessage(cb, endpointDiscoverer) {
  this.cb = cb;
  this.endpointDiscoverer = endpointDiscoverer;
}
util.inherits(StartConnectionMessage, Message);

function CloseConnectionMessage(reason, error) {
  this.reason = reason;
  this.error = error;
}
util.inherits(CloseConnectionMessage, Message);

function StartOperationMessage(operation, maxRetries, timeout) {
  this.operation = operation;
  this.maxRetries = maxRetries;
  this.timeout = timeout;
}
util.inherits(StartOperationMessage, Message);

function StartSubscriptionMessage(
    cb, streamId, resolveLinkTos, userCredentials, eventAppeared, subscriptionDropped, maxRetries, timeout
) {
  this.cb = cb;
  this.streamId = streamId;
  this.resolveLinkTos = resolveLinkTos;
  this.userCredentials = userCredentials;
  this.eventAppeared = eventAppeared;
  this.subscriptionDropped = subscriptionDropped;
  this.maxRetries = maxRetries;
  this.timeout = timeout;
}
util.inherits(StartSubscriptionMessage, Message);

/**
 * @private
 * @constructor
 * @property {object} endPoints
 * @property {object} endPoints.secureTcpEndPoint
 * @property {object} endPoints.tcpEndPoint
 */
function EstablishTcpConnectionMessage(endPoints) {
  this.endPoints = endPoints;
}
util.inherits(EstablishTcpConnectionMessage, Message);

function HandleTcpPackageMessage(connection, pkg) {
  this.connection = connection;
  this.package = pkg;
}
util.inherits(HandleTcpPackageMessage, Message);

function TcpConnectionErrorMessage(connection, error) {
  this.connection = connection;
  this.error = error;
}
util.inherits(TcpConnectionErrorMessage, Message);

function TcpConnectionEstablishedMessage(connection) {
  this.connection = connection;
}
util.inherits(TcpConnectionEstablishedMessage, Message);

function TcpConnectionClosedMessage(connection, error) {
  this.connection = connection;
  this.error = error;
}
util.inherits(TcpConnectionClosedMessage, Message);

function TimerTickMessage() {}
util.inherits(TimerTickMessage, Message);

function StartPersistentSubscriptionMessage(
    cb, subscriptionId, streamId, bufferSize, userCredentials, eventAppeared, subscriptionDropped,
    maxRetries, operationTimeout
) {
  this.cb = cb;
  this.subscriptionId = subscriptionId;
  this.streamId = streamId;
  this.bufferSize = bufferSize;
  this.userCredentials = userCredentials;
  this.eventAppeared = eventAppeared;
  this.subscriptionDropped = subscriptionDropped;
  this.maxRetries = maxRetries;
  this.timeout = operationTimeout;
}
util.inherits(StartPersistentSubscriptionMessage, Message);

module.exports = {
  StartConnectionMessage: StartConnectionMessage,
  CloseConnectionMessage: CloseConnectionMessage,
  StartOperationMessage: StartOperationMessage,
  StartSubscriptionMessage: StartSubscriptionMessage,
  EstablishTcpConnectionMessage: EstablishTcpConnectionMessage,
  HandleTcpPackageMessage: HandleTcpPackageMessage,
  TcpConnectionErrorMessage: TcpConnectionErrorMessage,
  TcpConnectionEstablishedMessage: TcpConnectionEstablishedMessage,
  TcpConnectionClosedMessage: TcpConnectionClosedMessage,
  TimerTickMessage: TimerTickMessage,
  StartPersistentSubscriptionMessage: StartPersistentSubscriptionMessage
};
