import {
  getISODateTime,
  generateAllTimes,
} from './../../app/src/utilities/appointmentTimes';
import moment from 'moment';

import chai from 'chai';
var expect = chai.expect;
chai.should();

describe('APPOINTMENT TIMES', () => {
  describe('GET_ISO_DATE_TIME', () => {
    const mut = getISODateTime;
    beforeEach(() => {});

    describe('when calling no inputs', () => {
      it('should return undefined', () => {
        let result = mut();
        expect(result).to.be.undefined;
      });
    });

    describe('when calling no date', () => {
      it('should return undefined', () => {
        let result = mut(undefined, '7:15 PM');
        expect(result).to.be.undefined;
      });
    });

    describe('when calling no time', () => {
      it('should return undefined', () => {
        let result = mut('20170117', undefined);
        expect(result).to.be.undefined;
      });
    });

    describe('when calling with PM date', () => {
      it('should return properly formatted string', () => {
        let result = mut('20170117', '7:15 PM');
        result.should.equal('2017-01-18T01:15:00.000Z');
      });
    });

    describe('when calling with AM date', () => {
      it('should return properly formatted string', () => {
        let result = mut('20170117', '7:15 AM');
        result.should.equal('2017-01-17T13:15:00.000Z');
      });
    });

    describe('when calling with AM date', () => {
      it('should return properly formatted string', () => {
        let result = moment('7:15 AM', 'hh:mm A').format('hh:mm A');
        result.should.equal('07:15 AM');
      });
    });
  });

  describe('GENERATE_ALL_TIMES', () => {
    const mut = generateAllTimes;
    beforeEach(() => {});

    describe('when calling', () => {
      it('should return am items as am, both display and value', () => {
        let result = mut(15);
        result[12].value.should.equal('04:00 AM');
        result[12].display.should.equal('4:00 AM');
      });
    });

    describe('when calling', () => {
      it('should return 15 min am items as correct hour and am, both display and value', () => {
        let result = mut(15);
        result[21].value.should.equal('06:15 AM');
        result[21].display.should.equal('6:15 AM');
      });
    });

    describe('when calling', () => {
      it('should return 30 min am items as correct hour and am, both display and value', () => {
        let result = mut(15);
        result[22].value.should.equal('06:30 AM');
        result[22].display.should.equal('6:30 AM');
      });
    });

    describe('when calling', () => {
      it('should return 45 min am items as correct hour and am, both display and value', () => {
        let result = mut(15);
        result[23].value.should.equal('06:45 AM');
        result[23].display.should.equal('6:45 AM');
      });
    });

    describe('when calling', () => {
      it('should return pm items as pm, both display and value', () => {
        let result = mut(15);
        result[60].value.should.equal('04:00 PM');
        result[60].display.should.equal('4:00 PM');
      });
    });

    describe('when calling', () => {
      it('should return 15 min PM items as correct hour and PM, both display and value', () => {
        let result = mut(15);
        result[61].value.should.equal('04:15 PM');
        result[61].display.should.equal('4:15 PM');
      });
    });

    describe('when calling', () => {
      it('should return 30 min PM items as correct hour and PM, both display and value', () => {
        let result = mut(15);
        result[62].value.should.equal('04:30 PM');
        result[62].display.should.equal('4:30 PM');
      });
    });

    describe('when calling', () => {
      it('should return 45 min PM items as correct hour and PM, both display and value', () => {
        let result = mut(15);
        result[63].value.should.equal('04:45 PM');
        result[63].display.should.equal('4:45 PM');
      });
    });

    describe('when calling', () => {
      it('should add preceding 0 for less 10 in AM on value', () => {
        let result = mut(15);
        result[20].value.should.equal('06:00 AM');
      });
    });

    describe('when calling', () => {
      it('should NOT add preceding 0 for greater than 10 in AM on value', () => {
        let result = mut(15);
        result[36].value.should.equal('10:00 AM');
      });
    });

    describe('when calling', () => {
      it('should add preceding 0 for less 10 in PM on value', () => {
        let result = mut(15);
        result[52].value.should.equal('02:00 PM');
      });
    });

    describe('when calling', () => {
      it('should NOT add preceding 0 for greater than 10 in PM on value', () => {
        let result = mut(15);
        result[84].value.should.equal('10:00 PM');
      });
    });
  });
});
