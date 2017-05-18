var demand = require('must');
var R = require('ramda');
var _fantasy = require('ramda-fantasy');
var Maybe = _fantasy.Maybe;
var logger = require('corelogger');
var uuid = require('uuid');
var buffer = require('buffer');

var fh = require('../../src/applicationFunctions/functionalHelpers')(R, _fantasy, buffer,logger);
var mut = require('../../src/applicationFunctions/eventFunctions')(R, uuid, fh);

const event = { Event:
{ EventStreamId: 'Trainerbdb77dea-f7c0-40b4-bf10-03c532b4bf32',
  EventId: '98e9b4fe-5fa0-4689-ad4f-f14d38efe7e6',
  EventNumber: 0,
  EventType: 'trainerHired',
  Data: new Buffer(JSON.stringify("hello world"), 'utf8'),
  Metadata: new Buffer(JSON.stringify("hello world"), 'utf8'),
IsJson: true,
Created: '636184017669017780',
CreatedEpoch: '1482804966901' },
IsResolved: false,
Link: null,
OriginalEvent:
{ EventStreamId: 'Trainerbdb77dea-f7c0-40b4-bf10-03c532b4bf32',
  EventId: '98e9b4fe-5fa0-4689-ad4f-f14d38efe7e6',
  EventNumber: 0,
  EventType: 'trainerHired',
  Data: new Buffer(JSON.stringify("hello world"), 'utf8'),
  Metadata: new Buffer(JSON.stringify("hello world"), 'utf8'),
  IsJson: true,
  Created: '636184017669017780',
  CreatedEpoch: '1482804966901' },
OriginalEventNumber: 0,
OriginalPosition: null,
OriginalStreamId: 'Trainerbdb77dea-f7c0-40b4-bf10-03c532b4bf32' };


describe('EVENT HELPERS', function() {
  var transformed;

  beforeEach(function() {
    transformed = mut.incomingEvent(event);
  });

  context('when calling incoming', function() {
    it('should return an object', function() {
      transformed.must.be.object()
    })
  });

  context('when calling incoming', function() {
    it('should return an object with proper eventtype', function() {
      transformed.eventName.must.equal('trainerHired');
    })
  });

});




