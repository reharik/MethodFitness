var util = require('util');
var uuid = require('uuid');

var Hash = require('../common/hash');
var TcpCommand = require('../systemData/tcpCommand');

/**
 * @private
 * @param {string} connectionName
 * @param {object} settings
 * @constructor
 * @property {number} totalOperationCount
 */
function OperationsManager(connectionName, settings) {
  this._connectionName = connectionName;
  this._settings = settings;

  this._totalOperationCount = 0;
  this._activeOperations = new Hash();
  this._waitingOperations = [];
  this._retryPendingOperations = [];
}
Object.defineProperty(OperationsManager.prototype, 'totalOperationCount', {
  get: function() {
    return this._totalOperationCount;
  }
});

OperationsManager.prototype.getActiveOperation = function(correlationId) {
  return this._activeOperations.get(correlationId);
};

function cleanUpError(connName, state, operation) {
    return new Error(util.format("Connection '%s' was closed. %s %s.", connName, state, operation.toString()));
}

OperationsManager.prototype.cleanUp = function() {
  var self = this;
  this._activeOperations.forEach(function(correlationId, operation){
    operation.operation.fail(cleanUpError(self._connectionName, 'Active', operation));
  });
  this._waitingOperations.forEach(function(operation) {
    operation.operation.fail(cleanUpError(self._connectionName, 'Waiting', operation));
  });
  this._retryPendingOperations.forEach(function(operation) {
    operation.operation.fail(cleanUpError(self._connectionName, 'Pending', operation));
  });

  this._activeOperations.clear();
  this._waitingOperations = [];
  this._retryPendingOperations = [];
  this._totalOperationCount = 0;
};

OperationsManager.prototype.checkTimeoutsAndRetry = function(connection) {
  if (!connection) throw new TypeError("Connection is null.");

  var retryOperations = [];
  var removeOperations = [];
  var self = this;
  this._activeOperations.forEach(function(correlationId, operation) {
    if (operation.connectionId !== connection.connectionId)
    {
      retryOperations.push(operation);
    }
    else if (operation.timeout > 0 && Date.now() - operation.lastUpdated > self._settings.operationTimeout)
    {
      var err = util.format("EventStoreConnection '%s': operation never got response from server.\n"
          + "UTC now: %s, operation: %s.",
          self._connectionName, new Date(), operation);
      self._settings.log.error(err);

      if (self._settings.failOnNoServerResponse)
      {
        operation.operation.fail(new Error(err));
        removeOperations.push(operation);
      }
      else
      {
        retryOperations.push(operation);
      }
    }
  });

  retryOperations.forEach(function(operation) {
    self.scheduleOperationRetry(operation);
  });
  removeOperations.forEach(function(operation) {
    self.removeOperation(operation);
  });

  if (this._retryPendingOperations.length > 0)
  {
    this._retryPendingOperations.sort(function(x,y) {
      if (x.seqNo < y.seqNo) return -1;
      if (x.seqNo > y.seqNo) return 1;
      return 0;
    });
    this._retryPendingOperations.forEach(function(operation) {
      var oldCorrId = operation.correlationId;
      operation.correlationId = uuid.v4();
      operation.retryCount += 1;
      self._logDebug("retrying, old corrId %s, operation %s.", oldCorrId, operation);
      self.scheduleOperation(operation, connection);
    });
    this._retryPendingOperations = [];
  }

  this.scheduleWaitingOperations(connection);
};

OperationsManager.prototype.scheduleOperationRetry = function(operation) {
  if (!this.removeOperation(operation))
    return;

  this._logDebug("ScheduleOperationRetry for %s.", operation);
  if (operation.maxRetries >= 0 && operation.retryCount >= operation.maxRetries)
  {
    var err = util.format("Retry limit reached. Operation: %s, RetryCount: %d", operation, operation.retryCount);
    operation.operation.fail(new Error(err));
    return;
  }
  this._retryPendingOperations.push(operation);
};

OperationsManager.prototype.removeOperation = function(operation) {
  this._activeOperations.remove(operation.correlationId);
  this._logDebug("RemoveOperation SUCCEEDED for %s.", operation);
  this._totalOperationCount = this._activeOperations.length + this._waitingOperations.length;
  return true;
};

OperationsManager.prototype.scheduleWaitingOperations = function(connection) {
  if (!connection) throw new TypeError("connection is null.");
  while (this._waitingOperations.length > 0 && this._activeOperations.length < this._settings.maxConcurrentItems)
  {
    this.scheduleOperation(this._waitingOperations.shift(), connection);
  }
  this._totalOperationCount = this._activeOperations.length + this._waitingOperations.length;
};

OperationsManager.prototype.enqueueOperation = function(operation) {
  this._logDebug("EnqueueOperation WAITING for %s.", operation);
  this._waitingOperations.push(operation);
};

OperationsManager.prototype.scheduleOperation = function(operation, connection) {
  if (this._activeOperations.length >= this._settings.maxConcurrentItems)
  {
    this._logDebug("ScheduleOperation WAITING for %s.", operation);
    this._waitingOperations.push(operation);
  }
  else
  {
    operation.connectionId = connection.connectionId;
    operation.lastUpdated = Date.now();
    this._activeOperations.add(operation.correlationId, operation);

    var pkg = operation.operation.createNetworkPackage(operation.correlationId);
    this._logDebug("ScheduleOperation package %s, %s, %s.", TcpCommand.getName(pkg.command), pkg.correlationId, operation);
    connection.enqueueSend(pkg);
  }
  this._totalOperationCount = this._activeOperations.length + this._waitingOperations.length;
};

OperationsManager.prototype._logDebug = function(message) {
  if (!this._settings.verboseLogging) return;

  if (arguments.length > 1)
    message = util.format.apply(util, Array.prototype.slice.call(arguments));

  this._settings.log.debug("EventStoreConnection '%s': %s.", this._connectionName, message);
};

module.exports = OperationsManager;
