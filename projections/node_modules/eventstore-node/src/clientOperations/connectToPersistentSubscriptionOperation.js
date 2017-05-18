var util = require('util');
var uuid = require('uuid');

var SubscriptionOperation = require('./subscriptionOperation');
var ClientMessage = require('../messages/clientMessage');
var TcpCommand = require('../systemData/tcpCommand');
var TcpFlags = require('../systemData/tcpFlags');
var TcpPackage = require('../systemData/tcpPackage');
var createBufferSegment = require('../common/bufferSegment');
var InspectionResult = require('./../systemData/inspectionResult');
var InspectionDecision = require('../systemData/inspectionDecision');
var results = require('../results');
var SubscriptionDropReason = require('../subscriptionDropReason');
var PersistentEventStoreSubscription = require('../persistentEventStoreSubscription');
var ensure = require('../common/utils/ensure');

function ConnectToPersistentSubscriptionOperation(
    log, cb, groupName, bufferSize, streamId, userCredentials, eventAppeared, subscriptionDropped,
    verboseLogging, getConnection
) {
  SubscriptionOperation.call(this, log, cb, streamId, false, userCredentials, eventAppeared, subscriptionDropped, verboseLogging, getConnection);

  this._groupName = groupName;
  this._bufferSize = bufferSize;
  this._subscriptionId = null;
}
util.inherits(ConnectToPersistentSubscriptionOperation, SubscriptionOperation);

ConnectToPersistentSubscriptionOperation.prototype._createSubscriptionPackage = function() {
  var dto = new ClientMessage.ConnectToPersistentSubscription(this._groupName, this._streamId, this._bufferSize);
  return new TcpPackage(TcpCommand.ConnectToPersistentSubscription,
      this._userCredentials !== null ? TcpFlags.Authenticated : TcpFlags.None,
      this._correlationId,
      this._userCredentials !== null ? this._userCredentials.username : null,
      this._userCredentials !== null ? this._userCredentials.password : null,
      createBufferSegment(dto.toBuffer()));
};

ConnectToPersistentSubscriptionOperation.prototype._inspectPackage = function(pkg) {
  if (pkg.command === TcpCommand.PersistentSubscriptionConfirmation)
  {
    var dto = ClientMessage.PersistentSubscriptionConfirmation.decode(pkg.data.toBuffer());
    this._confirmSubscription(dto.last_commit_position, dto.last_event_number);
    this._subscriptionId = dto.subscription_id;
    return new InspectionResult(InspectionDecision.Subscribed, "SubscriptionConfirmation");
  }
  if (pkg.command === TcpCommand.PersistentSubscriptionStreamEventAppeared)
  {
    var dto = ClientMessage.PersistentSubscriptionStreamEventAppeared.decode(pkg.data.toBuffer());
    this._onEventAppeared(new results.ResolvedEvent(dto.event));
    return new InspectionResult(InspectionDecision.DoNothing, "StreamEventAppeared");
  }
  if (pkg.command === TcpCommand.SubscriptionDropped)
  {
    var dto = ClientMessage.SubscriptionDropped.decode(pkg.data.toBuffer());
    if (dto.reason === ClientMessage.SubscriptionDropped.SubscriptionDropReason.AccessDenied)
    {
      this.dropSubscription(SubscriptionDropReason.AccessDenied, new Error("You do not have access to the stream."));
      return new InspectionResult(InspectionDecision.EndOperation, "SubscriptionDropped");
    }
    if (dto.reason === ClientMessage.SubscriptionDropped.SubscriptionDropReason.NotFound)
    {
      this.dropSubscription(SubscriptionDropReason.NotFound, new Error("Subscription not found"));
      return new InspectionResult(InspectionDecision.EndOperation, "SubscriptionDropped");
    }
    if (dto.reason === ClientMessage.SubscriptionDropped.SubscriptionDropReason.PersistentSubscriptionDeleted)
    {
      this.dropSubscription(SubscriptionDropReason.PersistentSubscriptionDeleted, new Error("Persistent subscription deleted."));
      return new InspectionResult(InspectionDecision.EndOperation, "SubscriptionDropped");
    }
    if (dto.reason === ClientMessage.SubscriptionDropped.SubscriptionDropReason.SubscriberMaxCountReached)
    {
      this.dropSubscription(SubscriptionDropReason.MaxSubscribersReached, new Error("Maximum subscribers reached."));
      return new InspectionResult(InspectionDecision.EndOperation, "SubscriptionDropped");
    }
    this.dropSubscription(SubscriptionDropReason.UserInitiated, null, this._getConnection());
    return new InspectionResult(InspectionDecision.EndOperation, "SubscriptionDropped");
  }
  return null;
};

ConnectToPersistentSubscriptionOperation.prototype._createSubscriptionObject = function(lastCommitPosition, lastEventNumber) {
  return new PersistentEventStoreSubscription(this, this._streamId, lastCommitPosition, lastEventNumber);
};

ConnectToPersistentSubscriptionOperation.prototype.notifyEventsProcessed = function(processedEvents) {
  ensure.notNull(processedEvents, "processedEvents");
  var dto = new ClientMessage.PersistentSubscriptionAckEvents({
    subscription_id: this._subscriptionId,
    processed_event_ids: processedEvents.map(function (x) {
      return new Buffer(uuid.parse(x));
    })
  });

  var pkg = new TcpPackage(TcpCommand.PersistentSubscriptionAckEvents,
      this._userCredentials !== null ? TcpFlags.Authenticated : TcpFlags.None,
      this._correlationId,
      this._userCredentials !== null ? this._userCredentials.username : null,
      this._userCredentials !== null ? this._userCredentials.password : null,
      createBufferSegment(dto.encode().toBuffer()));
  this._enqueueSend(pkg);
};

ConnectToPersistentSubscriptionOperation.prototype.notifyEventsFailed = function(processedEvents, action, reason) {
  ensure.notNull(processedEvents, "processedEvents");
  ensure.notNull(reason, "reason");
  var dto = new ClientMessage.PersistentSubscriptionNakEvents(
      this._subscriptionId,
      processedEvents.map(function(x) { return new Buffer(uuid.parse(x)); }),
      reason,
      action);

  var pkg = new TcpPackage(TcpCommand.PersistentSubscriptionNakEvents,
      this._userCredentials !== null ? TcpFlags.Authenticated : TcpFlags.None,
      this._correlationId,
      this._userCredentials !== null ? this._userCredentials.username : null,
      this._userCredentials !== null ? this._userCredentials.password : null,
      createBufferSegment(dto.toBuffer()));
  this._enqueueSend(pkg);
};

module.exports = ConnectToPersistentSubscriptionOperation;
