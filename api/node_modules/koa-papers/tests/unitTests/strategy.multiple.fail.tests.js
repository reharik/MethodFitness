var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var co = require('co');

var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('MULTIPLE_FAIL_RESPONSES', () => {
  describe('when_fail_is_called_by_multiple_strategies', () => {
    let SUT = undefined;
    let ctx;
    let next = (arg)=> {nextArg=arg};
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type:'fail', details:{error:'something went wrong!'}});
      var myStrategy1 = strategy({type:'fail', details:{error:'something went wrong!1'}});
      var myStrategy2 = strategy({type:'fail', details:{error:'something went wrong!2'}});
      var config = {
        strategies: [myStrategy, myStrategy1, myStrategy2]
      };
      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done()
      });
    });

    it('should_set_res_status_to_401', () => {
      ctx.status.should.equal(401);
    });

    it('should_set_res_header_WWWW-Authenticate_to_error_message', () => {
      ctx.get('WWW-Authenticate').length.should.equal(3);
      ctx.get('WWW-Authenticate')[0].should.equal('something went wrong!');
    });

    it('should_call_strategies_in_correct_order', () => {
      ctx.get('WWW-Authenticate')[0].should.equal('something went wrong!');
      ctx.get('WWW-Authenticate')[1].should.equal('something went wrong!1');
      ctx.get('WWW-Authenticate')[2].should.equal('something went wrong!2');
    });

  });

  describe('when_fail_is_called_by_strategy_and_fail_with_error_specified', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    let next = (arg)=> {nextArg=arg};
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type:'fail', details:{error:'something went wrong!', statusCode:402}});
      var myStrategy1 = strategy({type:'fail', details:{error:'something went wrong!1', statusCode:500}});
      var myStrategy2 = strategy({type:'fail', details:{error:'something went wrong!2', statusCode:502}});
      var config = {
        strategies: [myStrategy, myStrategy1, myStrategy2],
        failWithError: true
      };

      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done()
      });
    });

    it('should_call_next_on_with_highest_status', () => {
      ctx.body.message.should.equal('Bad Gateway');
    });

    it('should_not_set_res_header_WWWW-Authenticate_when_error_is_greater_than_401', () => {
      expect(ctx.get('WWW-Authenticate')).to.be.undefined;
    });
  });
});