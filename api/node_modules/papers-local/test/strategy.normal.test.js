/* global describe, it, expect, before */
/* jshint expr: true */

var should = require('chai').should();
var Strategy = require('../lib/strategy');

describe('Strategy', function() {
    
  describe('handling a request with valid credentials in body', function() {
    var strategy = Strategy(function(username, password) {
      return Promise.resolve({user: { id: '1234' }});
    });

    var result;
    before(async function() {
      let req = {body: {username: 'johndoe', password: 'secret'}};
      result = await strategy.authenticate(req);
    });


    it('should supply user', function() {
      console.log('==========result=========');
      console.log(result);
      console.log('==========END result=========');
      result.details.user.should.be.an.object;
      result.details.user.id.should.equal('1234');
    });
  });
  
  describe('handling a request with valid credentials in query', function() {
    var strategy = Strategy(function(username, password) {
      return Promise.resolve({user: { id: '1234' }});
    });

    var result;
    before(async function() {
      let req = {query: {username: 'johndoe', password: 'secret'}};
      result = await strategy.authenticate(req);
    });

    it('should supply user', function() {
      result.details.user.should.be.an.object;
      result.details.user.id.should.equal('1234');
    });
  });
  
  describe('handling a request without a body', function() {
    var strategy = Strategy(function(username, password) {
      throw new Error('should not be called');
    });

    var result;
    before(async function() {
      result = await strategy.authenticate({});
    });

    it('should fail with info and status', function() {
      result.details.error.should.equal('Missing credentials');
      result.details.status.should.equal(400);
    });
  });
  
  describe('handling a request with a body, but no username and password', function() {
    var strategy = Strategy(function(username, password) {
      throw new Error('should not be called');
    });

    var result;
    before(async function() {
      let req = {body:{}};
      result = await strategy.authenticate(req);
    });


    it('should fail with info and status', function() {
      result.details.error.should.equal('Missing credentials');
      result.details.status.should.equal(400);
    });
  });
  
  describe('handling a request without a body, but no password', function() {
    var strategy = Strategy(function(username, password) {
      return Promise.resolve({user: { id: '1234' }});
    });

    var result;
    before(async function() {
      let req = {body: {username: 'johndoe'}};
      result = await strategy.authenticate(req);
    });
    
    it('should fail with info and status', function() {
      result.details.error.should.equal('Missing credentials');
      result.details.status.should.equal(400);
    });
  });
  
  describe('handling a request without a body, but no username', function() {
    var strategy = Strategy(function(username, password) {
      return Promise.resolve({user: { id: '1234' }});
    });

    var result;
    before(async function() {
      let req = {body: { password: 'secret'}};
      result = await strategy.authenticate(req);
    });

    it('should fail with info and status', function() {
      result.details.error.should.equal('Missing credentials');
      result.details.status.should.equal(400);
    });
  });
  
});
