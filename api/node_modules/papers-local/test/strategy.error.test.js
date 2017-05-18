/* global describe, it, expect, before */

var should = require('chai').should();
var Strategy = require('../lib/strategy');


describe('Strategy', function() {
    
  describe('encountering an error during verification', function() {
    var strategy = Strategy(function(username, password) {
      throw new Error('something went wrong');
    });
    
    var result;
    
    before(function() {
      let req = {body: {username: 'johndoe', password: 'secret'}};
      result = strategy.authenticate(req);
    });
    
    it('should error', function() {
      result.details.exception.should.be.an.instanceof(Error);
      result.details.error.should.equal('something went wrong');
    });
  });
});
