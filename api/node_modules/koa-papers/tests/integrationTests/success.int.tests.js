var koa = require('koa');
var request = require('supertest-koa-agent');
var router = require('koa-router')();
var setups = require('./setups');

var chai = require('chai');
var expect = chai.expect;
chai.should();


describe('SUCCESS', ()=> {
  describe('when_stratedy_is_successful', ()=> {
    var SUTRequest;
    let app;
    before(() => {
      app = koa();

      router.post("/", function *() {
        SUTRequest = this;
        this.body = {the:"end"};
      });
      app.use(setups.basicSuccess(app));
      app.use(router.routes());
    });

    it("should_put_user_on_request", (done) => {
      request(app)
        .post('/')
        .expect((res)=> {
          SUTRequest.state.user.name.should.equal('bubba');
        })
        .expect(200, done);
    })
  })

});
