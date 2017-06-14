let config = require('config');

module.exports = function(_options) {
  let options = Object.assign({}, config.get('configs') || {}, _options || {});
  let container = require('./registry')(options);
  let dispatch = container.getInstanceOf('dispatch');
  setTimeout(() => dispatch().then(() => process.exit()), 1000); // eslint-disable-line no-process-exit

}();

