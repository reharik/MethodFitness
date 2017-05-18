
var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var co = require('co');

var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('ERROR_RESPONSE', () => {
  describe('when_error_is_called_by_strategy', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    let next = (arg)=> {nextArg=arg};
    beforeEach((done) => {
      ctx = context();
      var myStrategy = strategy({type:'error', details: {error: 'some error'}});
      var config = {
        strategies: [myStrategy]
      };
      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done()
      });
    });

    it('should_call_next_with_error', () => {
      ctx.body.should.equal('some error')
    });
  });
});
