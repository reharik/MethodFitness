/**
 * Created by rharik on 6/10/15.
 */

require('must');
const rx = require('rx');
const registry = require('./../../registry');
describe('appendToStreamPromiseTester', function() {
  let container;
  let moment;

  before(function() {
    container = registry();
    moment = container.getInstanceOf('moment');
  });
  beforeEach(function() {});
  context.only('get stream of events', () => {
    describe('get stream', async () => {
      try {
        const config = require('config');

        container = registry(config.configs);
        const es = container.getInstanceOf('eventstore');

        const conn = await es.gesConnection;
        const eventAppeared = es.eventEmitterInstance();

        conn.subscribeToAllFrom(
          null,
          false,
          eventAppeared.emitEvent,
          es.liveProcessingStarted,
          es.subscriptionDropped,
          es.credentials,
        );

        rx.Observable.fromEvent(eventAppeared.emitter, 'event').map(x => {
          console.log(`==========s==========`);
          console.log(s);
          console.log(`==========END s==========`);
        });
        //
        // const stream = await conn.readStreamEventsForward(
        //   'command',
        //   0,
        //   500,
        //   es.credentials,
        // );
        // console.log(`==========stream==========`);
        // console.log(stream);
        // console.log(`==========END stream==========`);
      } catch (ex) {
        console.log(`==========ex==========`);
        console.log(ex);
        console.log(`==========END ex==========`);
      }
    });
  });
});
