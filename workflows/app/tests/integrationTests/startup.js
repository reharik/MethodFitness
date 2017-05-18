///**
// * Created by reharik on 10/4/15.
// */
//
//require('must');
//var config = require('config');
//var extend = require('extend');
//describe('hireTrainerTester', function() {
//    var eventdispatcher;
//    var handlers;
//    var options = {};
//    var container;
//
//    before(function () {
//        extend(options, config.get('configs') || {});
//        container = require('../../registry')(options);
//        handlers = container.getArrayOfGroup('CommandHandlers');
//        eventdispatcher = container.getInstanceOf('eventdispatcher');
//    });
//
//    context('append to stream', ()=> {
//        it('should resolve with success', ()=> {
//            eventdispatcher.startDispatching(handlers);
//        })
//    });
//});
//
