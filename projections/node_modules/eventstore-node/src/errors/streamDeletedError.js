var util = require('util');
var Long = require('long');

function StreamDeletedError(streamOrTransactionId) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  if (typeof streamOrTransactionId === 'string') {
    this.message = util.format("Event stream '%s' is deleted.", streamOrTransactionId);
    this.stream = streamOrTransactionId;
    return;
  }
  if (Long.isLong(streamOrTransactionId)) {
    this.message = util.format("Stream is deleted for transaction %s.", streamOrTransactionId);
    this.transactionId = streamOrTransactionId;
    return;
  }
  throw new TypeError("second argument must be a stream name or transaction Id.");
}
util.inherits(StreamDeletedError, Error);

module.exports = StreamDeletedError;