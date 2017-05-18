module.exports = function(eventstorenode, logger) {
  return function(_options) {
    var options = _options && _options.eventstore ? _options.eventstore : {};
    var connection;
    logger.trace('accessing gesConnection');

    if (!connection) {
      logger.trace('IP:' + options.host + ':1113');
      connection = eventstorenode.createConnection({verbose: options.verbose, log:logger},{ host: options.host, port: 1113 });
      connection.connect();
      connection.once('connected', (tcpEndPoint) => {
        logger.debug('gesConnection: ' + connection);
      })
    }
    connection.on('error', function (err) {
      logger.error('Error occurred on ES connection:', err);
    });

    connection.on('closed', function (reason) {
      logger.info('ES connection closed, reason:', reason);
    });
    return connection;
  };
};
