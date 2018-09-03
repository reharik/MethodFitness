/**
 * Created by rharik on 6/10/15.
 */

require('must');
const registry = require('../registry-test');

describe('appendToStreamPromiseTester', function() {
  let container;
  let moment;

  before(function() {
    container = registry();
    moment = container.getInstanceOf('moment');
  });
  beforeEach(function() {});
  describe('get stream of events', () => {
    it('get stream', async () => {
      const es = container.getInstanceOf('eventstore');

      const stream = await es.gesConnection.readStreamEventsForward(
        command,
        0,
        500,
        es.credentials,
      );
      console.log(`==========stream==========`);
      console.log(stream);
      console.log(`==========END stream==========`);
    });
  });
  //
  // context('append to stream', () => {
  //   it('should throw error if no stream provided', () => {
  //     let apt = moment.utc('2017-08-20T00:14:46.928Z');
  //     let seven = moment('2017-08-20T19:00:39.805');
  //     let sevenZ = moment('2017-08-20T19:00:39.805').utc();
  //     let sevenZZ = moment().utc('2017-08-20T19:00:39.805');
  //     let now = moment();
  //     let nowZ = moment().utc();
  //     console.log(`==========now=========`);
  //     console.log(now.toString());
  //     console.log(now.toISOString());
  //     console.log(`===================`);
  //     console.log(nowZ.toString());
  //     console.log(nowZ.toISOString());
  //     console.log(`===================`);
  //     console.log(apt.toString());
  //     console.log(apt.toISOString());
  //     console.log(apt.isUtc());
  //     console.log(`===================`);
  //     console.log(seven.toString());
  //     console.log(seven.toISOString());
  //     console.log(`===================`);
  //     console.log(sevenZ.toString());
  //     console.log(sevenZ.toISOString());
  //     console.log(`===================`);
  //     // this one is not what we want
  //     console.log(sevenZZ.toString());
  //     console.log(sevenZZ.toISOString());
  //     console.log(`==========END now=========`);
  //   });
  //
  //   it('should throw error if no stream provided', () => {
  //     console.log(`==========moment().hours(9).minute(30).format()=========`);
  //     console.log(
  //       moment()
  //         .hours(9)
  //         .minute(30)
  //         .format(),
  //     );
  //     console.log(
  //       `==========END moment().hours(9).minute(30).format()=========`,
  //     );
  //
  //     console.log(`==========moment.utc().format()=========`);
  //     console.log(moment('2017-08-21T14:30:00.000Z').format());
  //     console.log(moment('2017-08-21T00:00:00.000Z').format());
  //     console.log(moment('2017-08-21').format());
  //     console.log(
  //       moment('2017-08-21')
  //         .utc()
  //         .format(),
  //     );
  //     console.log(`==========END moment.utc().format()=========`);
  //     let now = moment('2017-08-21T01:01:44.201Z');
  //     let apt = moment.utc('2017-08-21T14:30:07.799Z');
  //     console.log(`==========now=========`);
  //     console.log(now.toString());
  //     console.log(now.toISOString());
  //     console.log(`===================`);
  //     console.log(apt.toString());
  //     console.log(apt.toISOString());
  //     console.log(`==========END now=========`);
  //   });
  //
  //   it.only('should throw error if no stream provided', () => {
  //     let time = '09:30 PM';
  //     console.log(`==========moment(time).hour()=========`);
  //     console.log(moment(time).hour());
  //     console.log(`==========END moment(time).hour()=========`);
  //   });
  // });
});
