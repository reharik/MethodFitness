///**
// * Created by rharik on 6/19/15.
// */
//
//var should = require('chai').should();
//var expect = require('chai').expect;
//var eventStore;
//var eventModels;
//var _mut;
//var mut;
//var testHandler;
//var options = {
//    logger: {
//        moduleName: 'EventDispatcher',
//        level:'error'
//    }
//};
//var container;
//var config;
//describe('gesDispatcher', function() {
//
//    before(function() {
//        config = require('config');
//        var extend = require('extend')
//        extend(options, config.get('configs') || {});
//        container = require('../../registry_test')(options);
//        //var TestHandler = container.getInstanceOf('TestEventHandler');
//        //eventStore      = container.getInstanceOf('eventstore');
//        //eventModels     = container.getInstanceOf('eventmodels');
//        //_mut            = container.getInstanceOf('eventDispatcher');
//        //testHandler     = new TestHandler();
//        //mut             = _mut([testHandler]);
//    });
//
//    beforeEach(function() {
//        //testHandler.clearEventsHandled();
//    });
//
//    describe('#Instanciate Dispatcher', function() {
//        context('when instanciating dispatcher with no handlers', function () {
//            it('should throw proper error', async function () {
//                config.should.not.be.null;
//                console.log(container.whatDoIHave());
//            //    process.env['POSTGRES_PASSWORD'] = 'password';
//            //    process.env['POSTGRES_USER'] = 'methodfitness';
//            //    var uuid = require('uuid');
//            //    var script =
//            //        "begin; " +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"AK\", \"Name\":\"Alaska\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"AZ\", \"Name\":\"Arizona\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"AR\", \"Name\":\"Arkansas\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"CA\", \"Name\":\"California\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"CO\", \"Name\":\"Colorado\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"CT\", \"Name\":\"Connecticut\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"DE\", \"Name\":\"Delaware\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"DC\", \"Name\":\"District Of Columbia\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"FL\", \"Name\":\"Florida\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"GA\", \"Name\":\"Georgia\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"HI\", \"Name\":\"Hawaii\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"ID\", \"Name\":\"Idaho\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"IL\", \"Name\":\"Illinois\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"IN\", \"Name\":\"Indiana\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"IA\", \"Name\":\"Iowa\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"KS\", \"Name\":\"Kansas\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"KY\", \"Name\":\"Kentucky\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"LA\", \"Name\":\"Louisiana\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"ME\", \"Name\":\"Maine\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MD\", \"Name\":\"Maryland\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MA\", \"Name\":\"Massachusetts\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MI\", \"Name\":\"Michigan\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MN\", \"Name\":\"Minnesota\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MS\", \"Name\":\"Mississippi\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MO\", \"Name\":\"Missouri\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"MT\", \"Name\":\"Montana\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NE\", \"Name\":\"Nebraska\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NV\", \"Name\":\"Nevada\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NH\", \"Name\":\"New Hampshire\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NJ\", \"Name\":\"New Jersey\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NM\", \"Name\":\"New Mexico\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NY\", \"Name\":\"New York\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"NC\", \"Name\":\"North Carolina\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"ND\", \"Name\":\"North Dakota\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"OH\", \"Name\":\"Ohio\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"OK\", \"Name\":\"Oklahoma\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"OR\", \"Name\":\"Oregon\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"PA\", \"Name\":\"Pennsylvania\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"RI\", \"Name\":\"Rhode Island\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"SC\", \"Name\":\"South Carolina\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"SD\", \"Name\":\"South Dakota\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"TN\", \"Name\":\"Tennessee\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"TX\", \"Name\":\"Texas\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"UT\", \"Name\":\"Utah\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"VT\", \"Name\":\"Vermont\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"VA\", \"Name\":\"Virginia\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WA\", \"Name\":\"Washington\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WV\", \"Name\":\"West Virginia\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WI\", \"Name\":\"Wisconsin\"}' );" +
//            //        "insert into \"public\".\"states\" (id, document) values ('" + uuid.v4() + "', '{\"Code\":\"WY\", \"Name\":\"Wyoming\"}' );" +
//            //        "commit;";
//            //    var fu = require('pg-bluebird')
//            //    var pgb = new fu();
//            //    var result;
//            //    try {
//            //        var cnn = await pgb.connect('postgres://methodfitness:password@172.17.0.44:5432/methodfitness');
//            //        result = await cnn.client.query(script);
//            //        cnn.done();
//            //        return result;
//            //    } catch (error) {
//            //        console.log(error);
//            //    }
//            //
//            })
//        });
//    });
//    //describe('#StartDispatching', function() {
//    //    context('when calling StartDispatching', function() {
//    //        it('should handle event', async function() {
//    //            mut.startDispatching();
//    //            var eventData = {
//    //                Event           : {EventType: 'event'},
//    //                OriginalPosition: {},
//    //                OriginalEvent   : {
//    //                    Metadata: {
//    //                        eventName : 'someEventNotificationOn',
//    //                        streamType: 'event'
//    //                    },
//    //                    Data    : {'some': 'data'}
//    //                }
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
//    //            });
//    //            testHandler.getHandledEvents().length.should.equal(1);
//    //        });
//    //
//    //        it('should emit the proper type', async function() {
//    //            mut.startDispatching();
//    //            var eventData = {
//    //                Event           : {EventType: 'event'},
//    //                OriginalPosition: 'the originalPosition',
//    //                OriginalEvent   : {
//    //                    Metadata: {
//    //                        eventName : 'someEventNotificationOn',
//    //                        streamType: 'event'
//    //                    },
//    //                    Data    : {'some': 'data'}
//    //                }
//    //
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//    //            testHandler.eventsHandled[0].should.have.property('eventName');
//    //        });
//    //
//    //        it('should all the expected values on it', async function() {
//    //            mut.startDispatching();
//    //            var eventData     = {
//    //                Event           : {EventType: 'event'},
//    //                OriginalPosition: 'the originalPosition',
//    //                OriginalEvent   : {
//    //                    Metadata: {
//    //                        eventName : 'someEventNotificationOn',
//    //                        streamType: 'event'
//    //                    },
//    //                    Data    : {'some': 'data'}
//    //                }
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//    //            var eventsHandled = testHandler.eventsHandled[0];
//    //            eventsHandled.eventName.should.equal('someEventNotificationOn');
//    //            eventsHandled.originalPosition.should.equal('the originalPosition');
//    //            eventsHandled.metadata.eventName.should.equal('someEventNotificationOn');
//    //            eventsHandled.data.some.should.equal('data');
//    //        })
//    //    });
//    //
//    //    context('when calling StartDispatching with filter breaking vars', function() {
//    //        it('should not post event to handler for system event', async function() {
//    //            mut.startDispatching();
//    //            var eventData = {
//    //                Event           : {EventType: '$testEvent'},
//    //                OriginalPosition: {},
//    //                OriginalEvent   : {
//    //                    Metadata: {
//    //                        eventName : 'someEventNotificationOn',
//    //                        streamType: 'event'
//    //                    },
//    //                    Data    : {'some': 'data'}
//    //                }
//    //
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {
//    //            });
//    //            testHandler.eventsHandled.length.should.equal(0);
//    //        });
//    //        it('should not post event to handler for empty metadata', async function() {
//    //            mut.startDispatching();
//    //            var eventData = {
//    //                Event           : {EventType: 'testEvent'},
//    //                OriginalPosition: {},
//    //                OriginalEvent   : {
//    //                    Metadata: {},
//    //                    Data    : {'some': 'data'}
//    //                }
//    //
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//    //            testHandler.eventsHandled.length.should.equal(0);
//    //        });
//    //        it('should not post event to handler for empty data', async function() {
//    //            mut.startDispatching();
//    //            var eventData = {
//    //                Event           : {EventType: 'testEvent'},
//    //                OriginalPosition: {},
//    //                OriginalEvent   : {
//    //                    Metadata: {
//    //                        eventName : 'someEventNotificationOn',
//    //                        streamType: 'event'
//    //                    },
//    //                    Data    : {}
//    //                }
//    //
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//    //            testHandler.eventsHandled.length.should.equal(0);
//    //        });
//    //
//    //        it('should not break when empty metadata or data', async function() {
//    //            mut.startDispatching();
//    //            var eventData = {
//    //                Event           : {Type: 'testEvent'},
//    //                OriginalPosition: {},
//    //                OriginalEvent   : {}
//    //            };
//    //            await eventStore.appendToStreamPromise('someEventNotificationOn', eventData, ()=> {});
//    //            testHandler.eventsHandled.length.should.equal(0);
//    //        });
//    //
//    //    });
//    //});
//});
//
//
