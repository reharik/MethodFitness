var util = require('util');
var Long = require('long');

function WrongExpectedVersionError(action, streamOrTransactionId, expectedVersion) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.action = action;
  if (typeof streamOrTransactionId === 'string') {
    this.message = util.format("%s failed due to WrongExpectedVersion. Stream: %s Expected version: %d.", action, streamOrTransactionId, expectedVersion);
    this.stream = streamOrTransactionId;
    this.expectedVersion = expectedVersion;
    return;
  }
  if (Long.isLong(streamOrTransactionId)) {
    this.message = util.format("%s transaction failed due to WrongExpectedVersion. Transaction Id: %s.", action, streamOrTransactionId);
    this.transactionId = streamOrTransactionId;
    return;
  }
  throw new TypeError("second argument must be a stream name or a transaction Id.");
}
util.inherits(WrongExpectedVersionError, Error);

module.exports = WrongExpectedVersionError;