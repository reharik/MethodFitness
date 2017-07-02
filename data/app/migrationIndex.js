var config = require('config');

module.exports = function(_options) {
  let options = {};
  Object.assign(options, config.get('configs') || {}, _options || {});
  const container = require('./registry')(options);
  const mod = container.getInstanceOf('migration');
  mod().then(() => process.exit()); // eslint-disable-line no-process-exit
}();


