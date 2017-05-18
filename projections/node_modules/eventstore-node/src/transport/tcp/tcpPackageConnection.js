var util = require('util');
var uuid = require('uuid');

var LengthPrefixMessageFramer = require('./lengthPrefixMessageFramer');
var TcpConnection = require('./tcpConnection');
var TcpPackage = require('../../systemData/tcpPackage');
var TcpCommand = require('../../systemData/tcpCommand');

/**
 * @private
 * @param log
 * @param remoteEndPoint
 * @param connectionId
 * @param ssl
 * @param targetHost
 * @param validateServer
 * @param timeout
 * @param handlePackage
 * @param onError
 * @param connectionEstablished
 * @param connectionClosed
 * @constructor
 * @property {string} connectionId
 * @property {boolean} isClosed
 * @property {object} remoteEndPoint
 * @property {object} localEndPoint
 */
function TcpPackageConnection(
    log, remoteEndPoint, connectionId, ssl, targetHost, validateServer, timeout,
    handlePackage, onError, connectionEstablished, connectionClosed)
{
  this._connectionId = connectionId;
  this._log = log;
  this._handlePackage = handlePackage;
  this._onError = onError;

  //Setup callback for incoming messages
  this._framer = new LengthPrefixMessageFramer();
  this._framer.registerMessageArrivedCallback(this._incomingMessageArrived.bind(this));

  //TODO ssl
  var self = this;
  this._connection = TcpConnection.createConnectingConnection(
      log,
      connectionId,
      remoteEndPoint,
      //ssl,
      //targetHost,
      //validateServer,
      timeout,
      function(tcpConnection) {
        log.debug("TcpPackageConnection: connected to [%j, L%j, %s].", tcpConnection.remoteEndPoint, tcpConnection.localEndPoint, connectionId);
        connectionEstablished(self);
      },
      function(conn, error) {
        log.debug("TcpPackageConnection: connection to [%j, L%j, %s] failed. Error: %s.", conn.remoteEndPoint, conn.localEndPoint, connectionId, error);
        connectionClosed(self, error);
      },
      function (conn, had_error) {
        var error;
        if (had_error)
            error = new Error('transmission error.');

        log.debug("TcpPackageConnection: connection [%j, L%j, %s] was closed %s", conn.remoteEndPoint, conn.localEndPoint,
            connectionId, had_error ? "with error: " + error + "." : "cleanly.");

        connectionClosed(self, error);
      });
}
Object.defineProperty(TcpPackageConnection.prototype, 'connectionId', {
  enumerable: true,
  get: function() {
    return this._connectionId;
  }
});
Object.defineProperty(TcpPackageConnection.prototype, 'isClosed', {
  enumerable: true,
  get: function() {
    return this._connection.isClosed;
  }
});
Object.defineProperty(TcpPackageConnection.prototype, 'remoteEndPoint', {
  enumerable: true,
  get: function() {
    return this._connection.remoteEndPoint;
  }
});
Object.defineProperty(TcpPackageConnection.prototype, 'localEndPoint', {
  enumerable: true,
  get: function() {
    return this._connection.localEndPoint;
  }
});

TcpPackageConnection.prototype._onRawDataReceived = function(connection, data) {
  try {
    this._framer.unframeData(data);
  } catch(e) {
    this._log.error(e, "TcpPackageConnection: [%j, L%j, %s]. Invalid TCP frame received.", this.remoteEndPoint, this.localEndPoint, this._connectionId);
    this.close("Invalid TCP frame received");
    return;
  }

  connection.receive(this._onRawDataReceived.bind(this));
};

TcpPackageConnection.prototype._incomingMessageArrived = function(data) {
  var valid = false;
  var pkg;
  try
  {
    pkg = TcpPackage.fromBufferSegment(data);
    valid = true;
    this._handlePackage(this, pkg);
  }
  catch (e)
  {
    this._connection.close(util.format("Error when processing TcpPackage %s: %s",
        valid ? TcpCommand.getName(pkg.command) : "<invalid package>", e.message));

    var message = util.format("TcpPackageConnection: [%j, L%j, %s] ERROR for %s. Connection will be closed.",
        this.remoteEndPoint, this.localEndPoint, this._connectionId,
        valid ? TcpCommand.getName(pkg.command) : "<invalid package>");
    if (this._onError !== null)
      this._onError(this, e);
    this._log.debug(e, message);
  }
};

TcpPackageConnection.prototype.startReceiving = function() {
  if (this._connection === null)
    throw new Error("Failed connection.");
  this._connection.receive(this._onRawDataReceived.bind(this));
};

TcpPackageConnection.prototype.enqueueSend = function(pkg) {
  if (this._connection === null)
    throw new Error("Failed connection.");
  this._connection.enqueueSend(this._framer.frameData(pkg.asBufferSegment()));
};

TcpPackageConnection.prototype.close = function(reason) {
  if (this._connection === null)
    throw new Error("Failed connection.");
  this._connection.close(reason);
};

TcpPackageConnection.prototype.equals = function(other) {
  if (other === null) return false;
  return this._connectionId === other._connectionId;
};


module.exports = TcpPackageConnection;