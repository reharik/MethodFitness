var net = require('net');
var createBufferSegment = require('../../common/bufferSegment');

const MaxSendPacketSize = 64 * 1000;

function TcpConnection(log, connectionId, remoteEndPoint, onConnectionClosed) {
  this._socket = null;
  this._log = log;
  this._connectionId = connectionId;
  this._remoteEndPoint = remoteEndPoint;
  this._localEndPoint = null;
  this._onConnectionClosed = onConnectionClosed;
  this._receiveCallback = null;
  this._closed = false;
  this._sendQueue = [];
  this._receiveQueue = [];

  Object.defineProperty(this, 'remoteEndPoint', {
    enumerable: true,
    get: function() {
      return this._remoteEndPoint;
    }
  });
  Object.defineProperty(this, 'localEndPoint', {
    enumerable: true,
    get: function() {
      return this._localEndPoint;
    }
  });
}

TcpConnection.prototype._initSocket = function(socket) {
  this._socket = socket;
  this._localEndPoint = {host: socket.localAddress, port: socket.localPort};
  this._remoteEndPoint.host = socket.remoteAddress;

  this._socket.on('error', this._processError.bind(this));
  this._socket.on('data', this._processReceive.bind(this));
};

TcpConnection.prototype.enqueueSend = function(bufSegmentArray) {
  //console.log(bufSegmentArray);

  for(var i = 0; i < bufSegmentArray.length; i++) {
    var bufSegment = bufSegmentArray[i];
    this._sendQueue.push(bufSegment.toBuffer());
  }

  this._trySend();
};

TcpConnection.prototype._trySend = function() {
  if (this._sendQueue.length === 0 || this._socket === null) return;

  var buffers = [];
  var bytes = 0;
  var sendPiece = this._sendQueue.shift();
  while(sendPiece) {
    if (bytes + sendPiece.length > MaxSendPacketSize)
        break;

    buffers.push(sendPiece);
    bytes += sendPiece.length;

    sendPiece = this._sendQueue.shift();
  }

  var joinedBuffers = Buffer.concat(buffers, bytes);
  this._socket.write(joinedBuffers);
};

TcpConnection.prototype._processError = function(err) {
  this._closeInternal(err, "Socket error");
};

TcpConnection.prototype._processReceive = function(buf) {
  if (buf.length === 0) {
    //NotifyReceiveCompleted(0);
    this._closeInternal(null, "Socket closed");
    return;
  }

  //NotifyReceiveCompleted(buf.length)
  this._receiveQueue.push(buf);

  this._tryDequeueReceivedData();
};

TcpConnection.prototype.receive = function(cb) {
  this._receiveCallback = cb;
  this._tryDequeueReceivedData();
};

TcpConnection.prototype._tryDequeueReceivedData = function() {
  if (this._receiveCallback === null || this._receiveQueue.length === 0)
      return;

  var res = [];
  while(this._receiveQueue.length > 0) {
    var buf = this._receiveQueue.shift();
    var bufferSegment = createBufferSegment(buf);
    res.push(bufferSegment);
  }
  var callback = this._receiveCallback;
  this._receiveCallback = null;

  callback(this, res);

  var bytes = 0;
  for(var i=0;i<res.length;i++)
    bytes += res[i].count;

  //this._pendingReceivedBytes -= bytes;
};

TcpConnection.prototype.close = function(reason) {
  this._closeInternal(null, reason || "Normal socket close.");
};

TcpConnection.prototype._closeInternal = function(err, reason) {
  if (this._closed) return;
  this._closed = true;

  if (this._socket !== null) {
    this._socket.end();
    this._socket.unref();
    this._socket = null;
  }

  if (this._onConnectionClosed !== null)
      this._onConnectionClosed(this, err);
};

TcpConnection.createConnectingConnection = function(
    log, connectionId, remoteEndPoint, connectionTimeout,
    onConnectionEstablished, onConnectionFailed, onConnectionClosed
) {
  var connection = new TcpConnection(log, connectionId, remoteEndPoint, onConnectionClosed);
  var socket = net.connect(remoteEndPoint.port, remoteEndPoint.host);
  function onError(err) {
    if (onConnectionFailed)
      onConnectionFailed(connection, err);
  }
  socket.once('error', onError);
  socket.on('connect', function() {
    socket.removeListener('error', onError);
    connection._initSocket(socket);
    if (onConnectionEstablished)
      onConnectionEstablished(connection);
  });
  return connection;
};

module.exports = TcpConnection;