var should = require('chai').should();
var expect = require('chai').expect;
var moment = require('moment');
var uuid = require('uuid');

var mut = require('./../src/utils/widthAndColumn');

describe('WIDTH AND COLUMN TESTER', function() {
  describe('when calling with empty set', () => {
    beforeEach(() => {
    });

    it('should_return_empty_set', () => {
      mut.process([]).should.eql([]);
    });
  });

  describe('when calling with only 1 appointment', () => {
    var apts = [];
    beforeEach(() => {
      apts.push({startTime: moment(), endTime: moment().add(1, 'hour'), id: uuid.v4()});
    });

    it('should_return_apts_with_proper_width_and_column', () => {
      var result = mut.process(apts);
      result[0].width.should.equal(99);
      result[0].column.should.equal(1);
      result[0].margin.should.equal(0);
    });
  });

  describe('when calling with stagered apts', () => {
    var apts = [];
    beforeEach(() => {
      apts.push({startTime: moment(), endTime: moment().add(1, 'hour'), id: uuid.v4()});
      apts.push({startTime: moment().add(30, 'minutes'), endTime: moment().add(90, 'minutes'), id: uuid.v4()});
    });

    it('should_return_apts_with_proper_width_and_column', () => {
      var result = mut.process(apts);
      result[0].width.should.equal(99);
      result[0].column.should.equal(1);
      result[0].margin.should.equal(0);
      result[1].width.should.equal(49);
      result[1].column.should.equal(2);
      result[1].margin.should.equal(49);
    });
  });

//TODO need to figure out how wide things are actually going to be
  // describe('when calling with reopened slot', () => {
  //   var apts = [];
  //   beforeEach(() => {
  //     apts.push({startTime: moment(), endTime: moment().add(1, 'hour'), id: uuid.v4()});
  //     apts.push({startTime: moment().add(30, 'minutes'), endTime: moment().add(90, 'minutes'), id: uuid.v4()});
  //     apts.push({startTime: moment().add(60, 'minutes'), endTime: moment().add(120, 'minutes'), id: uuid.v4()});
  //   });
  //
  //   it('should_return_apts_with_proper_width_and_column', () => {
  //     var result = mut.process(apts);
  //     result[0].width.should.equal(49);
  //     result[0].column.should.equal(0);
  //     result[1].width.should.equal(49);
  //     result[1].column.should.equal(49);
  //     result[2].width.should.equal(49);
  //     result[2].column.should.equal(0);
  //   });
  // });

  describe('when calling with three overlapping', () => {
    var apts = [];
    beforeEach(() => {
      apts.push({startTime: moment(), endTime: moment().add(1, 'hour'), id: uuid.v4()});
      apts.push({startTime: moment().add(30, 'minutes'), endTime: moment().add(90, 'minutes'), id: uuid.v4()});
      apts.push({startTime: moment().add(30, 'minutes'), endTime: moment().add(90, 'minutes'), id: uuid.v4()});
    });

    it('should_return_apts_with_proper_width_and_column', () => {
      var result = mut.process(apts);
      result[0].width.should.equal(99);
      result[0].column.should.equal(1);
      result[0].margin.should.equal(0);
      result[1].width.should.equal(32);
      // result[1].column.should.equal(2);
      result[1].margin.should.equal(32);
      result[2].width.should.equal(32);
      result[2].column.should.equal(3);
      result[2].margin.should.equal(64);
    });
  });
});

