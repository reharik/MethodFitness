///**
// * Created by rharik on 6/19/15.
// */
//
//
//module.exports = function(eventHandlerBase) {
//    return class TestEventHandler extends eventHandlerBase {
//        constructor() {
//            super();
//            this.handlesEvents = ['someEventNotificationOn',
//                'someEventNotificationOff',
//                'someExceptionNotificationOn',
//                'someExceptionNotificationOff',
//                'testingEventNotificationOn',
//                'testingEventNotificationOff'];
//            this.eventsHandled = [];
//            this.eventHandlerName = 'TestEventHandler';
//        }
//
//        someEventNotificationOn(vnt) {
//           console.log('here');
//            this.eventsHandled.push(vnt);
//        }
//
//        someEventNotificationOff(vnt) {
//            this.eventsHandled.push(vnt);
//        }
//
//        someExceptionNotificationOn(vnt) {
//            throw(new Error());
//        }
//        someExceptionNotificationOff(vnt) {
//            throw(new Error());
//        }
//
//        testingEventNotificationOn(vnt){
//            this.eventsHandled.push(vnt);
//        }
//
//        testingEventNotificationOff(vnt){
//            this.eventsHandled.push(vnt);
//        }
//
//        clearEventsHandled() {
//            this.eventsHandled = [];
//        }
//    };
//};
