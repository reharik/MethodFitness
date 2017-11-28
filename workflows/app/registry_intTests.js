/**
 * Created by parallels on 9/3/15.
 */
let dagon = require('dagon');
let path = require('path');
module.exports = function(_options) {
  let options = _options || {};
  let container = dagon(options.dagon);
  let result;
  try {
    result = new container(x=> x.pathToRoot(path.join(__dirname, '..')) // eslint-disable-line new-cap
            .requireDirectoryRecursively('./app/src')
            .groupAllInDirectory('./app/src/CommandHandlers', 'CommandHandlers')
            .for('eventmodels').instantiate(i=>i.asFunc())
            .for('eventstore').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventhandlerbase').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventdispatcher').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventrepository').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('corelogger').renameTo('logger').instantiate(i=>i.asFunc().withParameters(options.logger || {}))
            .complete());
  } catch (ex) {
    console.log(ex);
    console.log(ex.stack);
  }
  return result;
};
