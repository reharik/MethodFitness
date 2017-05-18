///**
// * Created by reharik on 10/4/15.
// */
//
//require('must');
//var config = require('config');
//var extend = require('extend');
//var fs = require('fs');
//describe('hireTrainerTester', function() {
//    var eventmodels;
//    var eventstore;
//    var eventdispatcher;
//    var handlers;
//    var uuid;
//    var options = {
//        //dagon:{
//        //    logger: {
//        //        moduleName: 'EventHandlerBase'
//        //        }
//        //}
//    };
//    var container;
//
//
//    before(async function () {
//        extend(options, config.get('configs') || {});
//        container = require('../../registry')(options);
//        //uuid = container.getInstanceOf('uuid');
//        //eventmodels = container.getInstanceOf('eventmodels');
//        //eventstore = container.getInstanceOf('eventstore');
//        handlers = container.getArrayOfGroup('CommandHandlers');
//        eventdispatcher = container.getInstanceOf('eventdispatcher');
//    });
//
//    beforeEach(function () {
//    });
//
//    context('append to stream', ()=> {
//        it('should resolve with success', async ()=> {
//            //var appendData = {expectedVersion: -2};
//            //appendData.events = [eventmodels.eventData('hireTrainer',
//            //    {
//            //        credentials: {userName: 'admin', password: '123456'},
//            //        contact: {
//            //            firstName: 'Raif',
//            //            lastName: 'Harik',
//            //            emailAddress: 'reharik@gmail.com',
//            //            phone: '666.666.6666',
//            //            secondPhone: '777.777.7777'
//            //        },
//            //        address: {address1: '1706 willow st', address2: 'b', city: 'Austin', state: 'TX', zipCode: '78702'}
//            //        , dob: new Date()
//            //    },
//            //    {
//            //        commandTypeName: 'hireTrainer',
//            //        streamType: 'command',
//            //        continuationId:uuid.v4()
//            //    })];
//            //await eventstore.appendToStreamPromise('hireTrainer', appendData);
//
//            var result = await eventdispatcher.startDispatching(handlers);
//        })
//    });
//});
//
