/* global describe, it, expect, before */
/* jshint expr: true */
var should = require('chai').should();
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
    
  describe('failing authentication', function() {
    var strategy = Strategy(function(username, password) {
      return Promise.resolve(null);
    });
    
    var result;
    before(async function() {
      let req = {body: {username: 'johndoe', password: 'secret'}};
      result = await strategy.authenticate(req);

    });
    
    it('should fail', function() {
      result.should.eql({type: 'fail', details: {error: 'authentication failed'}});
    });
  });
  
  describe('failing authentication with info', function() {
    var strategy = new Strategy(function(username, password, done) {
      return Promise.resolve({ error: 'special message' });
    });

    var result;
    before(async function() {
      let req = {body: {username: 'johndoe', password: 'secret'}};
      result = await strategy.authenticate(req);
    });

    it('should fail', function() {
      result.should.eql({type: 'fail', details: {error: 'special message'}});
    });
  });
  
});
