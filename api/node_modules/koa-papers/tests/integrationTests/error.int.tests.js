var setups = require('./setups');
var koa = require('koa');
var request = require('supertest-koa-agent');
var router = require('koa-router')();

var chai = require('chai');
var expect = chai.expect;
chai.should();


describe('ERROR', ()=> {
  describe('when_stratedy_returns_an_error', ()=> {
    var SUTRequest;
    let app;
    before(() => {
      app = koa();
      router.post("/", function *() {
        SUTRequest = this;
        this.body = {the:"end"};
      });
      app.use(setups.error(app));
      app.use(router.routes());
    });

    it("should__500", (done) => {
      request(app)
        .post('/')
        // .expect( (res)=> {
        //   res.text.should.contain('wtf! soemthing happened!')})
        .expect(500, done)
    })
  })
});
