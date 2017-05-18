var createBufferSegment = require('../../common/bufferSegment');

const HeaderLength = 4;

function LengthPrefixMessageFramer(maxPackageSize) {
  this._maxPackageSize = maxPackageSize || 64*1024*1024;
  this._receivedHandler = null;
  this.reset();
}

LengthPrefixMessageFramer.prototype.reset = function() {
  this._messageBuffer = null;
  this._headerBytes = 0;
  this._packageLength = 0;
  this._bufferIndex = 0;
};

LengthPrefixMessageFramer.prototype.unframeData = function(bufferSegments) {
  for(var i = 0; i < bufferSegments.length; i++) {
    this._parse(bufferSegments[i]);
  }
};

LengthPrefixMessageFramer.prototype._parse = function(bytes) {
  var buffer = bytes.buffer;
  for (var i = bytes.offset; i < bytes.offset + bytes.count; i++)
  {
    if (this._headerBytes < HeaderLength)
    {
      this._packageLength |= (buffer[i] << (this._headerBytes * 8)); // little-endian order
      ++this._headerBytes;
      if (this._headerBytes === HeaderLength)
      {
        if (this._packageLength <= 0 || this._packageLength > this._maxPackageSize)
          throw new Error(["Package size is out of bounds: ", this._packageLength, "(max: ", this._maxPackageSize, "."].join(''));

        this._messageBuffer = new Buffer(this._packageLength);
      }
    }
    else
    {
      var copyCnt = Math.min(bytes.count + bytes.offset - i, this._packageLength - this._bufferIndex);
      bytes.buffer.copy(this._messageBuffer, this._bufferIndex, i, i + copyCnt);
      this._bufferIndex += copyCnt;
      i += copyCnt - 1;

      if (this._bufferIndex === this._packageLength)
      {
        if (this._receivedHandler !== null)
          this._receivedHandler(createBufferSegment(this._messageBuffer, 0, this._bufferIndex));
        this.reset();
      }
    }
  }
};

LengthPrefixMessageFramer.prototype.frameData = function(data) {
  var length = data.count;
  var lengthBuffer = new Buffer(HeaderLength);
  lengthBuffer.writeInt32LE(length, 0);
  return [
    createBufferSegment(lengthBuffer, 0, HeaderLength),
    data
  ];
};

LengthPrefixMessageFramer.prototype.registerMessageArrivedCallback = function(handler) {
  this._receivedHandler = handler;
};


module.exports = LengthPrefixMessageFramer;
