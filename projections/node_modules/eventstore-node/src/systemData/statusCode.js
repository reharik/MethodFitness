var ClientMessage = require('../messages/clientMessage');
var SliceReadStatus = require('../sliceReadStatus');

module.exports = {};

module.exports.convert = function(code) {
  switch(code) {
    case ClientMessage.ReadStreamEventsCompleted.ReadStreamResult.Success:
      return SliceReadStatus.Success;
    case ClientMessage.ReadStreamEventsCompleted.ReadStreamResult.NoStream:
      return SliceReadStatus.StreamNotFound;
    case ClientMessage.ReadStreamEventsCompleted.ReadStreamResult.StreamDeleted:
      return SliceReadStatus.StreamDeleted;
    default:
      throw new Error('Invalid code: ' + code)
  }
};