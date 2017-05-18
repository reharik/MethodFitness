var uuid = require('uuid');

function isValidId(id) {
  if (typeof id !== 'string') return false;
  var buf = uuid.parse(id);
  var valid = false;
  for(var i=0;i<buf.length;i++)
    if (buf[i] !== 0)
      valid = true;
  return valid;
}

/**
 * Create an EventData
 * @private
 * @param {string} eventId
 * @param {string} type
 * @param {boolean} [isJson]
 * @param {Buffer} [data]
 * @param {Buffer} [metadata]
 * @constructor
 */
function EventData(eventId, type, isJson, data, metadata) {
  if (!isValidId(eventId)) throw new TypeError("eventId must be a string containing a UUID.");
  if (typeof type !== 'string' || type === '') throw new  TypeError("type must be a non-empty string.");
  if (isJson && typeof isJson !== 'boolean') throw new TypeError("isJson must be a boolean.");
  if (data && !Buffer.isBuffer(data)) throw new TypeError("data must be a Buffer.");
  if (metadata && !Buffer.isBuffer(metadata)) throw new TypeError("metadata must be a Buffer.");

  this.eventId = eventId;
  this.type = type;
  this.isJson = isJson || false;
  this.data = data || new Buffer(0);
  this.metadata = metadata || new Buffer(0);
}

module.exports = EventData;
