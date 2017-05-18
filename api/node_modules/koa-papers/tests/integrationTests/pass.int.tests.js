var setups = require('./setups');
var koa = require('koa');
var request = require('supertest-koa-agent');
var router = require('koa-router')();

var chai = require('chai');
var expect = chai.expect;
chai.should();


describe('PASS', ()=> {
  describe('when_stratedy_returns_a_pass', ()=> {
    var SUTRequest;
    let app;
    before(() => {
      app = koa();
      router.post("/", function *() {
        SUTRequest = this;
        this.body = {the:"end"};
      });
      app.use(setups.pass(app));
      app.use(router.routes());
    });

    it("should_error_on_response_and_401", (done) => {
      request(app)
        .post('/')
        .expect("WWW-Authenticate", 'No successful login strategy found')
        .expect(401, done)
    })
  })
});
