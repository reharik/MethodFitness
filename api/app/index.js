let extend = require('extend');
let config = require('config');

process.env.ALLOW_CONFIG_MUTATIONS = true;

module.exports = function(_options) {
  let options = {
    dagon: {
      application: 'api'
    }
  };
  extend(true, options, config.get('configs') || {}, _options || {});
  let container = require('./registry')(options);
  let api = container.getInstanceOf('server');
  api();
}();


