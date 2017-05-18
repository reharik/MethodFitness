/**
 * Created by rharik on 10/1/15.
 */


let extend = require('extend');
let config = require('config');

module.exports = function(_options) {
  let options = {
        //dagon:{
        //    application:'projections'
        //}
  };
  extend(options, config.get('configs') || {}, _options || {});
  let container = require('./registry')(options);
  let dispatch = container.getInstanceOf('dispatch');
  setTimeout(dispatch, 1000);
    //throw(Error('error'))

}();

