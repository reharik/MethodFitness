/**
 * Created by parallels on 9/3/15.
 */
var dagon = require('dagon');
var path = require('path');
module.exports = function(_options) {
    var options = _options || {};
    var container = dagon(options.dagon);
    var result;
    try {
        result = new container(x=> x.pathToRoot(path.join(__dirname, '..'))
            .requireDirectoryRecursively('./app/src')
            .groupAllInDirectory('./app/src/CommandHandlers', 'CommandHandlers')
            .for('eventmodels').instantiate(i=>i.asFunc())
            .for('eventstore').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventhandlerbase').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventdispatcher').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('eventrepository').instantiate(i=>i.asFunc().withParameters(options.children || {}))
            .for('corelogger').renameTo('logger').instantiate(i=>i.asFunc().withParameters(options.logger || {}))
            .for('bluebird').renameTo('Promise')
            .complete());
    }catch(ex){
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};
