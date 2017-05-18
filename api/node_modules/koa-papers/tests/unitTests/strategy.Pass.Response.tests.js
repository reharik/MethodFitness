var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var co = require('co');

var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('PASS_RESPONSE', () => {
  describe('when_no_strategy_is_successful_and_no_specific_errors', () => {
    let SUT = undefined;
    let ctx;
    let next = (arg)=> {nextArg=arg};
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies: [myStrategy]
      };
      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done();
      });
    });

    it('should_set_res_status_to_401', () => {
      ctx.status.should.equal(401);
    });

    it('should_set_res_header_WWWW-Authenticate_to_error_message', () => {
      ctx.get('WWW-Authenticate')[0].should.equal('No successful login strategy found');
    });
  });

  describe('when_no_strategy_is_successful_and_no_specific_errors_and_fail_with_error', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    let next = (arg)=> {nextArg=arg};
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies: [myStrategy],
        failWithError: true
      };

      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done();
      });
    });

    it('should_call_next_with_proper_arg', () => {
      ctx.body.should.be.a('Error');
    });

    it('should_call_next_poper_error_message', () => {
      ctx.body.message.should.equal('Unauthorized');
    });

    it('should_set_res_header_WWWW-Authenticate_to_error_message', () => {
      ctx.get('WWW-Authenticate')[0].should.equal('No successful login strategy found');
    });
  });

  describe('when_no_strategy_is_successful_and_no_specific_errors_and_failureRedirect', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    beforeEach((done) => {
      ctx = context();
      ctx.redirect = (arg)=> {nextArg=arg};
      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies: [myStrategy],
        failureRedirect: 'some.url'
      };
      
      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [()=>{}]);
        done();
      });
    });

    it('should_call_next_with_proper_arg', () => {
      ctx.status.should.equal(401);
    });

    it('should_put_proper_url_on_location_header', () => {
      nextArg.should.equal('some.url');
    });

    it('should_set_res_header_WWWW-Authenticate_to_error_message', () => {
      ctx.get('WWW-Authenticate')[0].should.equal('No successful login strategy found');
    });
  });
});