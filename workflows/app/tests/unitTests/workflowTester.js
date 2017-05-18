/**
 * Created by rharik on 11/26/15.
 */


var should = require('chai').should();
var expect = require('chai').expect;

var container = require('../../registry_test')({});

var _fantasy = container.getInstanceOf('_fantasy');
var Maybe = _fantasy.Maybe;
var Right = _fantasy.Either.Right;
var Left = _fantasy.Either.Left;
var uuid = container.getInstanceOf('uuid');
var treis = container.getInstanceOf('treis');
var _mut = container.getInstanceOf('serveToHandlers');
var mut;
var eventData;
var continuationId = uuid.v4();
var sysEvent;
var matchingHandler;
var handlers;
var _testHandler = container.getInstanceOf('TestEventHandler');
var _testHandler2 = container.getInstanceOf('TestEventHandler2');
var testHandler;
var testHandler2;
var bootstrapper;

describe('MF_WORKFLOWS', function() {
    before(function() {
    });

    beforeEach(function() {
        sysEvent = {
            Event           : { EventType: '$event' }
        };
        eventData = {
            eventName       : 'someEventNotificationOn',
            continuationId  : '6d4f1122-b866-409f-98d8-10fb6451de3c',
          commitPosition: 123,
            data            : {some: 'data'}
        };

        bootstrapper = {
            eventName       : 'bootstrapApplication',
            continuationId  : '',
            originalPosition: {
                Position: {
                    commitPosition : '19957',
                    CommitPosition : '19957',
                    preparePosition: '19957',
                    PreparePosition: '19957'
                }
            },
            data            : {data: 'bootstrap please'}
        };

        handlers =[{
            handlesEvents:['someEventNotificationOn','someOtherCrap']
        },
                   {
                       handlesEvents:['someOtherCrap']
                   }];

        matchingHandler = {
            handlesEvents:['someEventNotificationOn','someOtherCrap']
        };

        testHandler = _testHandler();
        testHandler2 = _testHandler2();
        mut = _mut([testHandler,testHandler2]);

    });


    describe('#check if handler receives event', function() {
        context('when passing event', function () {
            it('should return the bool',  function () {

                console.log(container.whatDoIHave());

                //var trainer = Future((rej, ret) => {
                //    ret({
                //        login: function(event) {
                //            return event;
                //        }
                //    })
                //});
                //
                //var identity = _fantasy.Identity(event);
                //var vent = identity.ap(trainer)
                //console.log(vent);
//try{
//
//    require('../../index');
//
//}catch(ex){
//    var split = ex.stack.split('\n');
//
//split.forEach(x=>{console.log(x);console.log('\n')})
//    console.log({test:split})
//    //console.log(ex.stack);
//}

             })
        });
    });
});
