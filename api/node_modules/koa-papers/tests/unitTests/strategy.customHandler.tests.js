var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var chai = require('chai');
var expect = chai.expect;
chai.should();
var co = require('co');

describe('CUSTOM_HANDLER', () => {
  describe('when_fail_is_called_with_customHander', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    let next;
    let customHandlerArg;
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type: 'fail', details: {error: 'failed auth'}});
      var config = {
        strategies: [myStrategy],
        customHandler: (ctx, next, result) => {
          customHandlerArg = result;
        }
      };
      SUT = papers().registerMiddleware(config);
      co(function *() {
        yield SUT.call(ctx, [next]);
        done()
      });
    });

    it('should_pass_result_to_handler', () => {
      customHandlerArg.should.eql({type: 'fail', details: {errorMessage: 'failed auth', statusCode: 'Unauthorized'}});
    });

    it('should_not_call_next', () => {
      expect(nextArg).to.be.undefined;
    });
  });

  describe('when_error_is_called_with_customHander', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    let customHandlerArg;
    let standardizedResult = {errorMessage: 'some error', statusCode: 500, exception: 'some error'};
    let next = (arg)=> {
      nextArg = arg
    };
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type: 'error', details: {error: 'some error'}});
      var config = {
        strategies: [myStrategy],
        customHandler: (ctx, next, result) => {
          customHandlerArg = result;
        }
      };
      SUT = papers().registerMiddleware(config);
      co(function *() {
        yield SUT.call(ctx, [next]);
        done()
      });
    });

    it('should_pass_result_to_handler', () => {
      customHandlerArg.should.eql(standardizedResult);
    });

    it('should_not_call_next', () => {
      expect(nextArg).to.be.undefined;
    });
  });

  describe('when_success_is_called_with_customHander', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    let customHandlerArg;
    let user;
    let result;
    let next = (arg)=> {
      nextArg = 'next called'
    };
    beforeEach((done) => {
      ctx = context();
      user = {name: 'bubba'};
      result = {type: 'success', details: {user}};
      var myStrategy = strategy(result);
      var config = {
        strategies: [myStrategy],
        customHandler: (ctx, next, result) => {
          customHandlerArg = result;
        }
      };
      SUT = papers().registerMiddleware(config);
      co(function *() {
        yield SUT.call(ctx, [next]);
        done()
      });
    });

    it('should_pass_result_to_handler', () => {
      customHandlerArg.should.eql(result);
    });

    it('should_not_call_next', () => {
      expect(nextArg).to.be.undefined;
    });

  });
});