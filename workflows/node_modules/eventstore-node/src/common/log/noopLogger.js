function NoopLogger() {
}
NoopLogger.prototype.error = function() {};
NoopLogger.prototype.debug = function() {};
NoopLogger.prototype.info = function() {};

module.exports = NoopLogger;