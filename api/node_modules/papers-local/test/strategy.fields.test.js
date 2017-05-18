/* global describe, it, expect, before */
/* jshint expr: true */

var should = require('chai').should();
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
    
  describe('handling a request with valid credentials in body using custom field names', function() {
    var strategy = Strategy(function(username, password) {
      return Promise.resolve({user: { id: '1234' }});
    }, { usernameField: 'userid', passwordField: 'passwd' });

    var result;
    before(async function() {
      let req = {body: {userid: 'johndoe', passwd: 'secret'}};
      result = await strategy.authenticate(req);
    });
    
    it('should supply user', function() {
      result.details.user.should.be.an.object;
      result.details.user.id.should.equal('1234');
    });
  });
  
  describe('handling a request with valid credentials in body using custom field names with object notation', function() {
    var strategy = Strategy(function(username, password) {
        return Promise.resolve({user: { id: '1234' }});
      }, { usernameField: 'user[username]', passwordField: 'user[password]' });

    var result;
    before(async function() {
      let req = {body: {user: {username: 'johndoe', password: 'secret'}}};
      result = await strategy.authenticate(req);
    });

    it('should supply user', function() {
      result.details.user.should.be.an.object;
      result.details.user.id.should.equal('1234');
    });
  });
  
});
