var setups = require('./setups');
var koa = require('koa');
var request = require('supertest-koa-agent');
var router = require('koa-router')();

var chai = require('chai');
var expect = chai.expect;
chai.should();


describe('CUSTOM HANDLER', ()=> {
  describe('when_stratedy_is_successful', ()=> {
    var SUTRequest;
    let app;
    before(() => {
      app = koa();
      router.get("/", function *() {
        SUTRequest = this;
        this.body = {the:"end"};
      });
      app.use(setups.customHandlerSuccess(app));
      app.use(router.routes());
    });

    it("should_call_customHandler", (done) => {
      request(app)
        .get('/')
        .expect((res)=> {
          SUTRequest.request.customUser.should.equal('bubba');
        })
        .expect(200, done)
    })
  });

  describe('when_stratedy_is_failure', ()=> {
    var SUTRequest;
    let app;
    before(() => {
      app = koa();
      router.post("/", function *() {
        SUTRequest = this;
        this.body = {the:"end"};
      });
      app.use(setups.customHandlerFailure(app));
      app.use(router.routes());
    });

    it("should_set_status_to_401_and_return eg no continue on failure path", (done) => {
      request(app)
        .post('/')
        .expect((res)=> {
          expect(res.headers['WWW-Authenticate']).to.be.undefined;
        })
        .expect(401, done)
    })
  });

  describe('when_stratedy_is_error', ()=> {
    var SUTRequest;
    let app;
    before(() => {
      app = koa();
      router.post("/", function *() {
        SUTRequest = this;
        this.body = {the:"end"};
      });
      app.use(setups.customHandlerError(app));
      app.use(router.routes());
    });

    it("should_put_status_500", (done) => {
      request(app)
        .post('/')
        .expect(500, done)
    })
  })

});
