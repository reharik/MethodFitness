var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var chai = require('chai');
var expect = chai.expect;
chai.should();
var co = require('co');

describe('AUTHENTICATION', () => {
  describe('when_calling_middleware', () => {
    let SUT = undefined;
    let ctx;
    let next;
    beforeEach( (done) => {
      ctx = context();
      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies:[myStrategy],
        serializers:[()=>{}],
        deserializers:[()=>{}]
      };

      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done()
      })

    });

    it('should_put_methods_on_req', () => {
      ctx.logOut.should.be.function;
      ctx.isAuthenticated .should.be.function;
    })
  });

  describe('when_calling_middleware_with_session_for_first_time', () => {
    let SUT = undefined;
    let ctx;
    let next;
    beforeEach((done) => {
      ctx = context();

      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies:[myStrategy],
        serializers:[()=>{}],
        deserializers:[()=>{}],
        useSession: true
      };
      SUT = papers().registerMiddleware(config);

      co(function *(){
        ctx.session = {};
        yield SUT.call(ctx, [next]);
        done()
      })
    });

    it('should_not_put_user_on_res', () => {
      expect(ctx.request.user).to.be.undefined;
    })
  });

  describe('when_calling_middleware_with_session_after_auth', () => {
    let SUT;
    let ctx;
    let user;

    beforeEach((done) => {
      user = { name: 'bubba' };
      ctx = context();
      var myStrategy = strategy({type:'pass'});
      let next = (arg) => {
        nextArg = 'calledNext';
        done();
      };
      var config = {
        strategies:[myStrategy],
        serializers:[()=>{ Promise.resolve()}],
        deserializers:[(user)=>{return user;}],
        useSession: true
      };
      SUT = papers().registerMiddleware(config);

      co(function *(){
        ctx.session = {'papers':{user}};
        yield SUT.call(ctx, [next]);
        done()
      })
    });

    it('should_put_user_on_res', () => {
      ctx.state.user.should.eql(user);
    })
  });

  describe('when_calling_middleware_with_session_after_auth_but_bad_deserialize', () => {
    let SUT;
    let user;
    let next = ()=>{};
    var ctx;
    beforeEach((done) => {
      user = { name: 'bubba' };
      ctx = context();
      ctx.session = {'papers':{user}};
      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies:[myStrategy],
        serializers:[()=>{}],
        deserializers:[(user)=>{}],
        useSession: true
      };
      SUT = papers().registerMiddleware(config);

      co(function *(){
        yield SUT.call(ctx, [next]);
        done()
      })
    });

    it('should_remove_user_from_session', () => {
      expect(ctx.session.papers.user).to.be.undefined;
    })
  });

  //TODO can't figure out how to get the result of this to test
  describe.skip('when_calling_middleware_with_session_but_deserialize_throws', () => {
    let SUT;
    let user;
    let next = ()=>{};
    var ctx;
    beforeEach((done) => {
      user = { name: 'bubba' };
      ctx = context();
      ctx.session = {'papers':{user}};
      var myStrategy = strategy({type:'pass'});
      var config = {
        strategies:[myStrategy],
        serializers:[()=>{}],
        deserializers:[(user)=>{done();
          throw new Error();
        }],
        useSession: true
      };
      SUT = papers().registerMiddleware(config);

      co(function *(){
        yield SUT.call(ctx, [next]);
        done()
      })
    });

    it('should_return_500_with_the_error', () => {
      ctx.body.should.contain('Error thrown during deserialization of user.')
    })
  });

});
