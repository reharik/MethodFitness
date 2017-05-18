/**
 * Created by parallels on 9/3/15.
 */
let dagon = require('dagon');
let path = require('path');
module.exports = function(_options) {
  let options = _options || {};
  let container = dagon(options.dagon).container;
  let result;
  try {
    result = new container(x=> x.pathToRoot(path.join(__dirname, '..'))
            .requireDirectoryRecursively('./app/src')
            .requireDirectoryRecursively('./app/tests/unitTests/mocks')
                .for('eventstore').require('./app/tests/unitTests/mocks/eventStoreMock')
                .for('corelogger').renameTo('logger')
                .for('ramda').renameTo('R')
                .for('ramdafantasy').renameTo('_fantasy')
                .for('bluebird').renameTo('Promise')
                .for('eventstore').replaceWith('eventStoreMock')
                .for('appfuncs').replaceWith('applicationFunctionsPlugin')
                .complete(),
                x=>x.instantiate('eventstore').asFunc().withParameters(options.children || {})
                .instantiate('eventhandlerbase').asFunc().withParameters(options.children || {})
                .complete());

  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
  return result;
};

