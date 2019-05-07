let config = require('config');

module.exports = (async function(_options) {
  let options = Object.assign({}, config.get('configs') || {}, _options || {});

  let container = require('./registry')(options);
  const eventstore = container.getInstanceOf('eventstore');
  const connection = await eventstore.gesConnection;
  connection.setMaxListeners(20);

  let dispatch = container.getInstanceOf('dispatch');
  dispatch();
})();
