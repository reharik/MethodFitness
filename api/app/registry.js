var dagon = require('dagon');
var path = require('path');

module.exports = function(_options) {
  var options = _options || {};
  var container = dagon(options.dagon).container;
  var result;
  try {
    result = container(x =>
        x.pathToRoot(path.join(__dirname, '/../'))
          .requireDirectoryRecursively('./app/src')
          .requiredModuleRegistires(['ges-eventsourcing'])
          .for('corelogger').renameTo('logger')
          .for('ramda').renameTo('R')
          .for('ramdafantasy').renameTo('_fantasy')
          .for('bluebird').renameTo('Promise')
          .for('applicationFunctions').renameTo('appfuncs')
          .groupAllInDirectory('./app/src/controllers', 'controllers')
          .groupAllInDirectory('./app/src/schemas', 'schemas', true)
          .groupAllInDirectory('./app/src/routes/routers', 'routers_array')
          .groupAllInDirectory('./app/src/commands', 'commands')
          .complete(),
      x => x.instantiate('eventstore').asFunc().withParameters(options.children || {})
        .instantiate('pgFuture').asFunc().withParameters(options.children || {})
        .instantiate('logger').asFunc().withParameters(options.logger || {})
        .complete());
  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
  return result;
};
