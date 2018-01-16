let dagon = require('dagon');
let path = require('path');

module.exports = function(_options) {
  let options = _options || {};
  let container = dagon(options.dagon).container;
  let result;
  try {
    result = container(
      x => x.pathToRoot(path.join(__dirname, '/../'))
        .requireDirectoryRecursively('./app/src')
        .requiredModuleRegistires(['ges-eventsourcing'])
        .for('corelogger').renameTo('logger')
        .for('ramda').renameTo('R')
        .for('ramdafantasy').renameTo('_fantasy')
        .for('applicationFunctions').renameTo('appfuncs')
        .groupAllInDirectory('./app/src/controllers', 'controllers')
        .groupAllInDirectory('./app/src/schemas', 'schemas', true)
        .groupAllInDirectory('./app/src/routes/routers', 'routers_array')
        .groupAllInDirectory('./app/src/commands', 'commands')
        .complete(),
      x => x.instantiate('eventstore').asFunc().withParameters(options.children || {})
        .instantiate('eventRepository').asFunc().withParameters(options.children || {})
        .instantiate('logger').asFunc().withParameters(options.logger || {})
        .instantiate('rsRepository').asFunc().withParameters(options.children && options.children.postgres.config || {})
        .complete());
  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
  return result;
};
