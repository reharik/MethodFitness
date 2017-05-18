/**
 * Created by rharik on 6/10/15.
 */

require('must');


describe('appendToStreamPromiseTester', function() {
    var bootstrap;
    var mut;
    var EventData;
    var uuid;

    before(function(){
        bootstrap = require('../intTestBootstrap');
        EventData = bootstrap.getInstanceOf('EventData');
        uuid = bootstrap.getInstanceOf('uuid');
        mut = bootstrap.getInstanceOf('appendToStreamPromise');
    });

    beforeEach(function(){
    });

    context('append to stream', ()=> {
        it('should throw error if no stream provided', ()=>{
            (function(){mut()}).must.throw(Error,'Invariant Violation: must pass a valid stream name');
        });

        it('should throw error if no expectedVersion provided', ()=>{
            (function(){mut('myTestStream',{})}).must.throw(Error,'Invariant Violation: must pass data with an expected version of aggregate');
        });

        it('should throw error if no events provided', ()=>{
            var appendData = {
                expectedVersion: -2
            };
            (function(){mut('myTestStream',appendData)}).must.throw(Error,'Invariant Violation: must pass data with at least one event');
        });

        it('should resolve with success', async ()=> {
            var appendData = { expectedVersion: -2};
            appendData.events = [new EventData( 'testing1', { data:'someData' }, {eventTypeName:'testingEventNotificationOff'})];
            var result = await mut('myTestStream',appendData);
            result.Status.must.equal('Success');
        })
    });
});

