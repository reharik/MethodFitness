var util = require('util');
var Long = require('long');

function AccessDeniedError(action, streamOrTransactionId) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.action = action;
  if (typeof streamOrTransactionId === 'string') {
    this.message = util.format("%s access denied for stream '%s'.", action, streamOrTransactionId);
    this.stream = streamOrTransactionId;
    return;
  }
  if (Long.isLong(streamOrTransactionId)) {
    this.message = util.format("%s access denied for transaction %s.", action, streamOrTransactionId);
    this.transactionId = streamOrTransactionId;
    return;
  }
  throw new TypeError("second argument must be a stream name or transaction Id.");
}
util.inherits(AccessDeniedError, Error);

module.exports = AccessDeniedError;