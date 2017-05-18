/**
 * Create a buffer segment
 * @private
 * @param {Buffer} buf
 * @param {number} [offset]
 * @param {number} [count]
 * @constructor
 */
function BufferSegment(buf, offset, count) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buf must be a buffer');

  this.buffer = buf;
  this.offset = offset || 0;
  this.count = count || buf.length;
}

BufferSegment.prototype.toString = function() {
  return this.buffer.toString('utf8', this.offset, this.offset + this.count);
};

BufferSegment.prototype.toBuffer = function() {
  if (this.offset === 0 && this.count === this.buffer.length)
      return this.buffer;
  return this.buffer.slice(this.offset, this.offset + this.count);
};

BufferSegment.prototype.copyTo = function(dst, offset) {
  this.buffer.copy(dst, offset, this.offset, this.offset + this.count);
};

module.exports = function(buf, offset, count) {
  return new BufferSegment(buf, offset, count);
};