///**
// * Created by reharik on 11/3/15.
// */
//
//
var demand = require('must');
var R = require('ramda');
var _fantasy = require('ramda-fantasy');
var Maybe = _fantasy.Maybe;
var buffer = require('buffer');
var logger = require('corelogger');
var mut = require('../../src/applicationFunctions/functionalHelpers')(R, _fantasy, buffer,logger);

var noEventTypeEvent = {};

var incomingEvent = {
    Event           : { EventType: 'event' },
  commitPosition: '123',
    OriginalEvent   : {
        Metadata: {
            eventName : 'someEventNotificationOn',
            streamType: 'event'
        },
        Data    : {'some': 'data'}
    }
};

var noMetadataEvent = {
    Event: {EventType: 'event'}
};

var noDataEvent = {
    Event: {EventType: 'event'},
    OriginalEvent   : {
        Metadata: {
            eventName : 'someEventNotificationOn',
            streamType: 'event'
        }
    }
};

var sysEvent = {
    Event           : { EventType: '$event' }
};


describe('FUNCTIONAL HELPERS', function() {
    before(function() {
    });

    beforeEach(function() {
    });

    context('when calling parseBuffer on a buffer', function() {
        it('should return a maybe of the parsed data', function() {
            var buffer = new Buffer(JSON.stringify(noMetadataEvent), 'utf8');
            mut.safeParseBuffer(buffer).must.eql(Maybe.of(noMetadataEvent));
        })
    });

    context('when calling parseBuffer on a string', function() {
        it('should return a maybe Nothing', function() {
            mut.safeParseBuffer(noMetadataEvent).must.eql(Maybe.Nothing());
        })
    });

});
