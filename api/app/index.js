let config = require('config');

process.env.ALLOW_CONFIG_MUTATIONS = true;

module.exports = (function(_options) {
  let options = {
    dagon: {
      application: 'api',
    },
  };

  Object.assign(options, config.get('configs') || {}, _options || {});
  console.log(`==========JSON.stringify(options, null, 4)==========`);
  console.log(JSON.stringify(options, null, 4));
  console.log(`==========END JSON.stringify(options, null, 4)==========`);

  try {
    let container = require('./registry')(options);
    let api = container.getInstanceOf('server');
    api();
  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
})();
