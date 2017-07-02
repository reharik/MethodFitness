/**
 * Created by rharik on 10/1/15.
 */

require('must');
var config = require('config');
var fs = require('fs');

describe('appendToStreamPromiseTester', function() {
    var handlers;
    var eventDispatcher;
    var options = {
        //dagon:{
        //    logger: {
        //        moduleName: 'EventHandlerBase'
        //        }
        //}
    };
    var container;


    before(function(){
        Object.assign(options, config.get('configs') || {});
        container = require('../../registry')(options);
        handlers = container.getArrayOfGroup('EventHandlers');
        eventDispatcher = container.getInstanceOf('eventDispatcher');

        });

        context('append to stream', ()=> {
            it('should resolve with success', async ()=> {
                var result = await eventDispatcher.startDispatching(handlers);
            })
        });
    });

