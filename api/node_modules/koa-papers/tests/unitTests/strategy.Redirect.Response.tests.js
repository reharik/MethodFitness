var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var co = require('co');

var chai = require('chai');
var expect = chai.expect;
chai.should();

//TODO tests around the schema returned by strat

describe('REDIRECT_RESPONSE', () => {
  describe('when_redirect_is_called_by_strategy', () => {
    let SUT = undefined;
    let ctx;
    let nextArg;
    beforeEach((done) => {
      ctx = context();
      ctx.redirect = (arg)=> {nextArg=arg};
      var myStrategy = strategy({type:'redirect', details:{ url: 'some.url', statusCode: 302}});
      var config = {
        strategies: [myStrategy]
      };
      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [()=>{}]);
        done();
      });

    });

    it('should_set_res_status_to_302', () => {
      ctx.status.should.equal(302);
    });

    it('should_put_proper_url_on_location_header', () => {
      nextArg.should.equal('some.url');
    });
  });

});