var config = require('config');

function wait(mod) {
}

module.exports = function(_options) {
  let options = {};
  Object.assign(options, config.get('configs') || {}, _options || {});
  console.log('==========options=========');
  console.log(options);
  console.log('==========END options=========');

  const container = require('./registry')(options);
  const mod = container.getInstanceOf('seedES');
  setTimeout(() => mod().then(() => process.exit()), 1000); // eslint-disable-line no-process-exit

}();

