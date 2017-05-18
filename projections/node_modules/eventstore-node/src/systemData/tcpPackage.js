var uuid = require('uuid');

var createBufferSegment = require('../common/bufferSegment');
var TcpFlags = require('./tcpFlags');

const CommandOffset = 0;
const FlagsOffset = CommandOffset + 1;
const CorrelationOffset = FlagsOffset + 1;
const AuthOffset = CorrelationOffset + 16;
const MandatorySize = AuthOffset;

function TcpPackage(command, flags, correlationId, login, password, data) {
  this.command = command;
  this.flags = flags;
  this.correlationId = correlationId;
  this.login = login || null;
  this.password = password || null;
  this.data = data || null;
}

TcpPackage.fromBufferSegment = function(data) {
  if (data.length < MandatorySize)
    throw new Error("ArraySegment too short, length: " + data.length);

  var command = data.buffer[data.offset + CommandOffset];
  var flags = data.buffer[data.offset + FlagsOffset];

  var correlationId = uuid.unparse(data.buffer, data.offset + CorrelationOffset);

  var headerSize = MandatorySize;
  var login = null, pass = null;
  if ((flags & TcpFlags.Authenticated) !== 0)
  {
    var loginLen = data.buffer[data.offset + AuthOffset];
    if (AuthOffset + 1 + loginLen + 1 >= data.count)
        throw new Error("Login length is too big, it doesn't fit into TcpPackage.");
    login = data.buffer.toString('utf8', data.offset + AuthOffset + 1, data.offset + AuthOffset + 1 + loginLen);

    var passLen = data.buffer[data.offset + AuthOffset + 1 + loginLen];
    if (AuthOffset + 1 + loginLen + 1 + passLen > data.count)
        throw new Error("Password length is too big, it doesn't fit into TcpPackage.");
    headerSize += 1 + loginLen + 1 + passLen;
    pass = data.buffer.toString('utf8', data.offset + AuthOffset + 1 + loginLen + 1, data.offset + headerSize);
  }
  return new TcpPackage(
      command, flags, correlationId, login, pass,
      createBufferSegment(data.buffer, data.offset + headerSize, data.count - headerSize));
};

TcpPackage.prototype.asBuffer = function() {
  if ((this.flags & TcpFlags.Authenticated) !== 0) {
    var loginBytes = new Buffer(this.login);
    if (loginBytes.length > 255) throw new Error("Login serialized length should be less than 256 bytes.");
    var passwordBytes = new Buffer(this.password);
    if (passwordBytes.length > 255) throw new Error("Password serialized length should be less than 256 bytes.");

    var res = new Buffer(MandatorySize + 2 + loginBytes.length + passwordBytes.length + (this.data ? this.data.count : 0));
    res[CommandOffset] = this.command;
    res[FlagsOffset] = this.flags;
    uuid.parse(this.correlationId, res, CorrelationOffset);

    res[AuthOffset] = loginBytes.length;
    loginBytes.copy(res, AuthOffset + 1);
    res[AuthOffset + 1 + loginBytes.length] = passwordBytes.length;
    passwordBytes.copy(res, AuthOffset + 2 + loginBytes.length);

    if (this.data)
      this.data.copyTo(res, res.length - this.data.count);

    return res;
  } else {
    var res = new Buffer(MandatorySize + (this.data ? this.data.count : 0));
    res[CommandOffset] = this.command;
    res[FlagsOffset] = this.flags;
    uuid.parse(this.correlationId, res, CorrelationOffset);
    if (this.data)
      this.data.copyTo(res, AuthOffset);
    return res;
  }
};

TcpPackage.prototype.asBufferSegment = function() {
  return createBufferSegment(this.asBuffer());
};

module.exports = TcpPackage;