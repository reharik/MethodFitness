
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
        .requireDirectoryRecursively('./app/tests/unitTests/mocks')
        .groupAllInDirectory('./app/src/CommandHandlers', 'CommandHandlers_array')
        .requiredModuleRegistires(['ges-eventsourcing'])
        .for('eventstore').require('./app/tests/unitTests/mocks/eventStoreMock')
        .for('corelogger').renameTo('logger')
        .for('ramda').renameTo('R')
        .for('ramdafantasy').renameTo('_fantasy')
        .for('applicationFunctions').renameTo('appfuncs')
        .for('eventstore').replaceWith('eventStoreMock')
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

