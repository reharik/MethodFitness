/**
 * Created by parallels on 9/6/15.
 */
module.exports = function(Promise, events) {

    var subscriptionMock = class SubscriptionMock extends events.EventEmitter {
        constructor() {
            super();
        }
    };

    var subscription = new subscriptionMock();
    return {
        appendToStreamPromise: function(name, data) {
            subscription.emit('event', data);
            return Promise.resolve(data);
        },
        subscribeToAllFrom: function(){
            return subscription;
        }
    };
};
