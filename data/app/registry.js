/**
 * Created by parallels on 9/3/15.
 */
"use strict";

var dagon = require('dagon');
var path = require('path');

module.exports = function(_options) {
    var options   = _options || {};
    var container = dagon(options.dagon).container;
    var result;
    try {
        result = container(
                x=> x.pathToRoot(__dirname+'/../')
                .for('corelogger').renameTo('logger')
                  .requireDirectoryRecursively('./app/src')
                  .requiredModuleRegistires(['ges-eventsourcing'])
                    .for('ramda').renameTo('R')
                    .for('ramdafantasy').renameTo('_fantasy')
                    .for('bluebird').renameTo('Promise')
                    .for('applicationFunctions').renameTo('appfuncs')
                    .complete(),
                x=>x
                    .instantiate('eventstore').asFunc().withParameters(options.children || {})
                    .instantiate('pgFuture').asFunc().withParameters(options.children || {})
                    .instantiate('logger').asFunc().withParameters(options.logger || {})
                    .complete());
    } catch (ex) {
        console.log(ex);
        console.log(ex.stack);
    }
    return result;
};