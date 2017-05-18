var util = require('util');
var fs = require('fs');
var os = require('os');

function FileLogger(filePath, append) {
  this._filePath = filePath;
  if (!append) {
    try {
      fs.unlinkSync(filePath);
    } catch(e) {}
  }
}

function createLine(level, args, argsStartIndex) {
  var msg = util.format.apply(util, Array.prototype.slice.call(args, argsStartIndex));
  return util.format('%s %s - %s%s', new Date().toISOString().substr(11,12), level, msg, os.EOL);
}

FileLogger.prototype.debug = function() {
  var line = createLine('DEBUG', arguments, 0);
  fs.appendFileSync(this._filePath, line);
};

FileLogger.prototype.info = function() {
  var line = createLine('INFO', arguments, 0);
  fs.appendFileSync(this._filePath, line);
};

FileLogger.prototype.error = function(e) {
  var hasError = e instanceof Error;
  var line = createLine('ERROR', arguments, hasError ? 1 : 0);
  if (hasError) {
    line += e.stack + os.EOL;
  }
  fs.appendFileSync(this._filePath, line);
};


module.exports = FileLogger;