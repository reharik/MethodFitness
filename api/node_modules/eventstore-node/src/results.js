var util = require('util');
var uuid = require('uuid');
var Long = require('long');
var ensure = require('./common/utils/ensure');

/**
 * @public
 * @param {!number|!Long} commitPosition
 * @param {!number|!Long} preparePosition
 * @constructor
 * @property {!Long} commitPosition
 * @property {!Long} preparePosition
 */
function Position(commitPosition, preparePosition) {
  ensure.notNull(commitPosition, "commitPosition");
  ensure.notNull(preparePosition, "preparePosition");
  commitPosition = Long.fromValue(commitPosition);
  preparePosition = Long.fromValue(preparePosition);

  Object.defineProperties(this, {
    commitPosition: {
      enumerable: true, value: commitPosition
    },
    preparePosition: {
      enumerable: true, value: preparePosition
    }
  });
}

Position.prototype.compareTo = function(other) {
  if (this.commitPosition.lt(other.commitPosition) || (this.commitPosition.eq(other.commitPosition)&& this.preparePosition.lt(other.preparePosition)))
    return -1;
  if (this.commitPosition.gt(other.commitPosition) || (this.commitPosition.eq(other.commitPosition) && this.preparePosition.gt(other.preparePosition)))
    return 1;
  return 0;
};

Position.prototype.toString = function() {
  return [this.commitPosition.toString(), this.preparePosition.toString()].join("/");
};


const EventReadStatus = {
  Success: 'success',
  NotFound: 'notFound',
  NoStream: 'noStream',
  StreamDeleted: 'streamDeleted'
};

/**
 * @param {object} ev
 * @constructor
 * @property {string} eventStreamId
 * @property {string} eventId
 * @property {number} eventNumber
 * @property {string} eventType
 * @property {number} createdEpoch
 * @property {?Buffer} data
 * @property {?Buffer} metadata
 * @property {boolean} isJson
 */
function RecordedEvent(ev) {
  Object.defineProperties(this, {
    eventStreamId: {enumerable: true, value: ev.event_stream_id},
    eventId: {enumerable: true, value: uuid.unparse(ev.event_id.buffer, ev.event_id.offset)},
    eventNumber: {enumerable: true, value: ev.event_number},
    eventType: {enumerable: true, value: ev.event_type},
    //Javascript doesn't have .Net precision for time, so we use created_epoch for created
    created: {enumerable: true, value: new Date(ev.created_epoch ? ev.created_epoch.toNumber() : 0)},
    createdEpoch: {enumerable: true, value: ev.created_epoch ? ev.created_epoch.toNumber() : 0},
    data: {enumerable: true, value: ev.data ? ev.data.toBuffer() : new Buffer(0)},
    metadata: {enumerable: true, value: ev.metadata ? ev.metadata.toBuffer() : new Buffer(0)},
    isJson: {enumerable: true, value: ev.data_content_type === 1}
  });
}

/**
 * @param {object} ev
 * @constructor
 * @property {?RecordedEvent} event
 * @property {?RecordedEvent} link
 * @property {?RecordedEvent} originalEvent
 * @property {boolean} isResolved
 * @property {?Position} originalPosition
 * @property {string} originalStreamId
 * @property {number} originalEventNumber
 */
function ResolvedEvent(ev) {
  Object.defineProperties(this, {
    event: {
      enumerable: true,
      value: ev.event === null ? null : new RecordedEvent(ev.event)
    },
    link: {
      enumerable: true,
      value: ev.link === null ? null : new RecordedEvent(ev.link)
    },
    originalEvent: {
      enumerable: true,
      get: function() {
        return this.link || this.event;
      }
    },
    isResolved: {
      enumerable: true,
      get: function() {
        return this.link !== null && this.event !== null;
      }
    },
    originalPosition: {
      enumerable: true,
      value: (ev.commit_position && ev.prepare_position) ? new Position(ev.commit_position, ev.prepare_position) : null
    },
    originalStreamId: {
      enumerable: true,
      get: function() {
        return this.originalEvent.eventStreamId;
      }
    },
    originalEventNumber: {
      enumerable: true,
      get: function() {
        return this.originalEvent.eventNumber;
      }
    }
  });
}

/**
 *
 * @param {string} status
 * @param {string} stream
 * @param {number} eventNumber
 * @param {object} event
 * @constructor
 * @property {string} status
 * @property {string} stream
 * @property {number} eventNumber
 * @property {ResolvedEvent} event
 */
function EventReadResult(status, stream, eventNumber, event) {
  Object.defineProperties(this, {
    status: {enumerable: true, value: status},
    stream: {enumerable: true, value: stream},
    eventNumber: {enumerable: true, value: eventNumber},
    event: {
      enumerable: true, value: status === EventReadStatus.Success ? new ResolvedEvent(event) : null
    }
  });
}

/**
 * @param {number} nextExpectedVersion
 * @param {Position} logPosition
 * @constructor
 * @property {number} nextExpectedVersion
 * @property {Position} logPosition
 */
function WriteResult(nextExpectedVersion, logPosition) {
  Object.defineProperties(this, {
    nextExpectedVersion: {
      enumerable: true, value: nextExpectedVersion
    },
    logPosition: {
      enumerable: true, value: logPosition
    }
  });
}

/**
 * @param {string} status
 * @param {string} stream
 * @param {number} fromEventNumber
 * @param {string} readDirection
 * @param {object[]} events
 * @param {number} nextEventNumber
 * @param {number} lastEventNumber
 * @param {boolean} isEndOfStream
 * @constructor
 * @property {string} status
 * @property {string} stream
 * @property {number} fromEventNumber
 * @property {string} readDirection
 * @property {ResolvedEvent[]} events
 * @property {number} nextEventNumber
 * @property {number} lastEventNumber
 * @property {boolean} isEndOfStream
 */
function StreamEventsSlice(
    status, stream, fromEventNumber, readDirection, events, nextEventNumber, lastEventNumber, isEndOfStream
) {
  Object.defineProperties(this, {
    status: {
      enumerable: true, value: status
    },
    stream: {
      enumerable: true, value: stream
    },
    fromEventNumber: {
      enumerable: true, value: fromEventNumber
    },
    readDirection: {
      enumerable: true, value: readDirection
    },
    events: {
      enumerable: true, value: events ? events.map(function(ev) { return new ResolvedEvent(ev); }) : []
    },
    nextEventNumber: {
      enumerable: true, value: nextEventNumber
    },
    lastEventNumber: {
      enumerable: true, value: lastEventNumber
    },
    isEndOfStream: {
      enumerable: true, value: isEndOfStream
    }
  })
}

/**
 * @param {string} readDirection
 * @param {Position} fromPosition
 * @param {Position} nextPosition
 * @param {ResolvedEvent[]} events
 * @constructor
 * @property {string} readDirection
 * @property {Position} fromPosition
 * @property {Position} nextPosition
 * @property {ResolvedEvent[]} events
 */
function AllEventsSlice(readDirection, fromPosition, nextPosition, events) {
  Object.defineProperties(this, {
    readDirection: {
      enumerable: true, value: readDirection
    },
    fromPosition: {
      enumerable: true, value: fromPosition
    },
    nextPosition: {
      enumerable: true, value: nextPosition
    },
    events: {
      enumerable: true, value: events ? events.map(function(ev){ return new ResolvedEvent(ev); }) : []
    },
    isEndOfStream: {
      enumerable: true, value: events === null || events.length === 0
    }
  });
}

/**
 * @param {Position} logPosition
 * @constructor
 * @property {Position} logPosition
 */
function DeleteResult(logPosition) {
  Object.defineProperties(this, {
    logPosition: {
      enumerable: true, value: logPosition
    }
  });
}

/**
 * @param {string} stream
 * @param {boolean} isStreamDeleted
 * @param {number} metastreamVersion
 * @param {object} streamMetadata
 * @constructor
 * @property {string} stream
 * @property {boolean} isStreamDeleted
 * @property {number} metastreamVersion
 * @property {object} streamMetadata
 */
function RawStreamMetadataResult(stream, isStreamDeleted, metastreamVersion, streamMetadata) {
  ensure.notNullOrEmpty(stream);
  Object.defineProperties(this, {
    stream: {enumerable: true, value: stream},
    isStreamDeleted: {enumerable: true, value: isStreamDeleted},
    metastreamVersion: {enumerable: true, value: metastreamVersion},
    streamMetadata: {enumerable: true, value: streamMetadata}
  });
}

const PersistentSubscriptionCreateStatus = {
  Success: 'success',
  NotFound: 'notFound',
  Failure: 'failure'
};

/**
 * @param {string} status
 * @constructor
 * @property {string} status
 */
function PersistentSubscriptionCreateResult(status) {
  Object.defineProperties(this, {
    status: {enumerable: true, value: status}
  });
}

const PersistentSubscriptionUpdateStatus = {
  Success: 'success',
  NotFound: 'notFound',
  Failure: 'failure',
  AccessDenied: 'accessDenied'
};

/**
 * @param {string} status
 * @constructor
 * @property {string} status
 */
function PersistentSubscriptionUpdateResult(status) {
  Object.defineProperties(this, {
    status: {enumerable: true, value: status}
  });
}

const PersistentSubscriptionDeleteStatus = {
  Success: 'success',
  Failure: 'failure'
};

/**
 * @param {string} status
 * @constructor
 * @property {string} status
 */
function PersistentSubscriptionDeleteResult(status) {
  Object.defineProperties(this, {
    status: {enumerable: true, value: status}
  });
}

// Exports Constructors
module.exports.Position = Position;
module.exports.ResolvedEvent = ResolvedEvent;
module.exports.EventReadStatus = EventReadStatus;
module.exports.EventReadResult = EventReadResult;
module.exports.WriteResult = WriteResult;
module.exports.StreamEventsSlice = StreamEventsSlice;
module.exports.AllEventsSlice = AllEventsSlice;
module.exports.DeleteResult = DeleteResult;
module.exports.RawStreamMetadataResult = RawStreamMetadataResult;
module.exports.PersistentSubscriptionCreateResult = PersistentSubscriptionCreateResult;
module.exports.PersistentSubscriptionCreateStatus = PersistentSubscriptionCreateStatus;
module.exports.PersistentSubscriptionUpdateResult = PersistentSubscriptionUpdateResult;
module.exports.PersistentSubscriptionUpdateStatus = PersistentSubscriptionUpdateStatus;
module.exports.PersistentSubscriptionDeleteResult = PersistentSubscriptionDeleteResult;
module.exports.PersistentSubscriptionDeleteStatus = PersistentSubscriptionDeleteStatus;
