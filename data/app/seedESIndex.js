var extend = require('extend');
var config = require('config');

function wait(mod) {
}

module.exports = function(_options) {
  var options = {};
  extend(options, config.get('configs') || {}, _options || {});
  const container = require('./registry')(options);
  const mod = container.getInstanceOf('seedES');
  setTimeout(() => mod().then(() => process.exit()), 1000); // eslint-disable-line no-process-exit

}();

