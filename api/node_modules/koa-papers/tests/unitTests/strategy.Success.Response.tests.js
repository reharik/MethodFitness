
var papers = require('./../../src/papers');
var context = require('./../helpers/context');
var strategy = require('./../helpers/testStrategy');
var co = require('co');

var chai = require('chai');
var expect = chai.expect;
chai.should();

describe('SUCCESS_RESPONSE', () => {
  describe('when_success_is_called_by_strategy', () => {
    let SUT = undefined;
    let nextArg;
    let user;
    let ctx;
    beforeEach((done) => {
      ctx = context();
      var next = Promise.resolve('calledNext');
      user = {name: 'bubba'};
      var myStrategy = strategy({type:'success', details: {user}});
      var config = {
        strategies: [myStrategy]
      };
      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [next]);
        done();
      });
    });

    it('should_put_user_on_req', () => {
      ctx.state.user.should.eql(user)
    });
    //TODO can't figure out how to tell if next is yielded
    it.skip('should_call_next', () => {
      nextArg.should.eql('calledNext')
    });
  });

  describe('when_success_is_called_by_strategy_with_session', () => {
    let SUT = undefined;
    let nextArg;
    let user;
    let ctx;

    beforeEach((done) => {
      ctx = context();
      var next = (arg) => {
        nextArg = 'calledNext';
        done();
      };
      user = {name: 'bubba'};
      var myStrategy = strategy({type: 'success', details: {user}});
      var config = {
        strategies: [myStrategy],
        serializers: [(user)=> {
          user.serialized = true;
          return user
        }],
        deserializers: [(user)=> {
          user.deserialized = true;
          return user
        }],
        useSession: true
      };

      SUT = papers().registerMiddleware(config);
      co(function *() {
          ctx.session = {papers: {}};
        yield SUT.call(ctx, [next]);
        done();
      });
    });

    it('should_put_user_on_req', () => {
      ctx.state.user.should.eql( { name: 'bubba', serialized: true } )
    });

    it('should_put_serialize_and_put_user_in_papers_session', () => {
      ctx.session.papers.user.serialized.should.be.true;
    });

    it('should_call_next', () => {
      nextArg.should.eql('calledNext')
    });
  });

  describe('when_success_is_called_by_strategy_with_session_with_returnTo', () => {
    let SUT = undefined;
    let nextArg;
    let user;
    let ctx;

    beforeEach((done) => {
      ctx = context();
      ctx.redirect = (arg) => {
        nextArg = arg;
        done();
      };
      user = {name: 'bubba'};
      var myStrategy = strategy({type:'success', details: {user}});
      var config = {
        strategies: [myStrategy],
        serializers: [(user)=>{user.serialized=true; return user}],
        deserializers: [(user)=>{return user}],
        useSession: true
      };
      ctx.session = {returnTo: 'some.url'};

      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [()=>{}]);
      });
    });

    it('should_put_user_on_req', () => {
      ctx.state.user.should.eql( { name: 'bubba', serialized: true } )
    });

    it('should_put_user_in_papers_session', () => {
      ctx.session.papers.user.serialized.should.be.true;
    });

    it('should_delete_url_from_session', () => {
      expect(ctx.session.returnTo).to.be.undefined;
    });

    it('should_redirect_to_said_url', () => {
      ctx.status.should.equal(200);
      nextArg.should.equal('some.url');
    });
  });

  describe('when_success_is_called_by_strategy_with_session_with_successRedirect', () => {
    let SUT = undefined;
    let nextArg;
    let user;
    let ctx;

    beforeEach((done) => {
      ctx = context();
      ctx.redirect = (arg) => {
        nextArg = arg;
      };
      user = {name: 'bubba'};
      var myStrategy = strategy({type:'success', details: {user}});
      var config = {
        successRedirect: "a.great.url",
        strategies: [myStrategy],
        serializers: [(user)=>{user.serialized=true; return user}],
        deserializers: [(user)=>{return user}],
        useSession: true

      };
      ctx.session = {papers: {}};

      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [()=>{}]);
        done();
      });
    });

    it('should_put_user_on_req', () => {
      ctx.state.user.should.eql( { name: 'bubba', serialized: true } )
    });

    it('should_redirect_to_said_url', () => {
      ctx.status.should.equal(200);
      nextArg.should.equal('a.great.url');
    });
  });

  describe('when_success_is_called_by_strategy_with_session_returnTo_and_successRedirect', () => {
    let SUT = undefined;
    let nextArg;
    let user;
    let ctx;

    beforeEach((done) => {
      ctx = context();
      ctx.redirect = (arg) => {
        nextArg = arg;
      };
      user = {name: 'bubba'};
      var myStrategy = strategy({type:'success', details: {user}});
      var config = {
        successRedirect: "a.great.url",
        strategies: [myStrategy],
        serializers: [(user)=>{user.serialized=true; return user}]
      };
      ctx.session = {returnTo: 'some.url', papers: {}};

      SUT = papers().registerMiddleware(config);
      co(function *(){
        yield SUT.call(ctx, [()=>{}]);
        done();
      });
    });

    it('should_allow_return_to_to_take_precedence', () => {
      nextArg.should.equal('some.url');
    });
  });
});
