let dagon = require('dagon');
let path = require('path');
const metaLogger = require('./src/metaLogger')();

module.exports = function(_options) {
  let options = _options || {};
  let container = dagon(options.dagon).container;
  let result;

  const metaLoggerConfig = {
    beforeExecution: (logger, key, name, args) => {
      let resolvedName = name || 'anonymous function';
      logger.debug(`${key} called in ${resolvedName}`);
      logger.trace(
        metaLogger.iterateArguments(
          args,
          `${key} called with ${args.length <= 0 ? 'no ' : ''}arguments \n`,
        ),
      );
    },
    afterExecution: (logger, key, name, result) => {
      logger.trace(`${key} result:\n ${metaLogger.itemToString(result)}`);
    },
  };
  console.log(`==========options.children==========`);
  console.log(options.children);
  console.log(process.env.LOGGING_LEVEL);
  console.log(`==========END options.children==========`);

  try {
    result = container(
      x =>
        x
          .pathToRoot(path.join(__dirname, '/../'))
          .requireDirectoryRecursively('./app/src')
          .groupAllInDirectory(
            './app/src/CommandHandlers',
            'CommandHandlers_array',
          )
          .requiredModuleRegistires(['ges-eventsourcing'])
          .for('corelogger')
          .renameTo('logger')
          .for('ramda')
          .renameTo('R')
          .for('ramdafantasy')
          .renameTo('_fantasy')
          .for('applicationFunctions')
          .renameTo('appfuncs')
          .groupAllInDirectory('./app/src/events', 'esEvents')
          .complete(),
      x =>
        x
          .instantiate('eventstore')
          .asFunc()
          .withParameters(options.children || {})
          .instantiate('eventRepository')
          .asFunc()
          .withParameters(options.children || {})
          .instantiate('logger')
          .asFunc()
          .withParameters(options.logger || {})
          .instantiate('rsRepository')
          .asFunc()
          .withParameters(options.children.postgres.config || {})
          .instantiate('metaLogger')
          .initializeWithMethod('wrapper')
          .withInitParameters(metaLoggerConfig)
          .complete(),
    );
  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
  return result;
};
