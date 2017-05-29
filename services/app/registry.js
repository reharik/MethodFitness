
let dagon = require('dagon');
let path = require('path');

module.exports = function(_options) {
  let options = _options || {};
  let container = dagon(options.dagon).container;
  let result;
  try {
    result = container(
                x=> x.pathToRoot(path.join(__dirname, '/../'))
                .requireDirectoryRecursively('./app/src')
                .requiredModuleRegistires(['ges-eventsourcing'])
                .for('corelogger').renameTo('logger')
                  .for('ramda').renameTo('R')
                  .for('ramdafantasy').renameTo('_fantasy')
                  .for('bluebird').renameTo('Promise')
                  .for('applicationFunctions').renameTo('appfuncs')
                  .complete(),
                x=>x.instantiate('eventstore').asFunc().withParameters(options.children || {})
                .instantiate('pgFuture').asFunc().withParameters(options.children || {})
                .instantiate('eventRepository').asFunc().withParameters(options.children || {})
                .instantiate('gesConnection').asFunc().withParameters(options.children || {})
                .instantiate('logger').asFunc().withParameters(options.logger || {})
                .complete());
  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
  return result;
};