var _request = require('./request');

module.exports = function context() {

  var status = 200;
  var _headers = {};
  var body = '';
  var state = {};
  var request = _request();
  var response = {body};
  var get = function (name) {
    return this._headers[name];
  };

  var set = function (name, value) {
    this._headers[name] = value;
  };

  var _throw = function(type, msg, status){
    this.status = status;
    this.body = msg;
  };



   return {
     status,
     _headers,
     body,
     request,
       response,
     state,
     set,
     get,
     throw:_throw
   }
};
