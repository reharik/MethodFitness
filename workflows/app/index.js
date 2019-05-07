let config = require('config');

module.exports = (async function(_options) {
  try {
    let options = Object.assign(
      {},
      config.get('configs') || {},
      _options || {},
    );
    let container = require('./registry')(options);
    let pingDB = container.getInstanceOf('pingDB');
    await pingDB();
    let dispatch = container.getInstanceOf('dispatch');
    dispatch();
  } catch (ex) {
    console.log(`=========="OMG"==========`);
    console.log('OMG');
    console.log(ex);
    console.log(`==========END "OMG"==========`);
  }
})();
