var extend = require('extend');
var config = require('config');

module.exports = async function(_options) {
  var options = {};
  extend(options, config.get('configs') || {}, _options || {});
  const container = require('./registry')(options);
  const mod1 = container.getInstanceOf('migration');
  const mod2 = container.getInstanceOf('seedES');
  await mod1(); // eslint-disable-line no-process-exit
  await mod2().then(() => process.exit()); // eslint-disable-line no-process-exit
}();


