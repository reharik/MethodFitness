module.exports = function(rsRepository, moment, logger) {
  return function SessionEventHandler() {
    logger.info('SessionEventHandler started up');

    async function sessionCreated(event) {
      logger.info('handling sessionCreated event');
      var sql = `INSERT INTO "session" (
            "id", 
            "client",
            "type",
            "document"
            ) VALUES (
            '${event.id}',
            '${event.clientId}',
            '${event.sessionType}',
            '${JSON.stringify(event)}')`;
      return await rsRepository.saveQuery(sql);
    }

    return {
      handlerName: 'SessionEventHandler',
      sessionCreated
    };
  };
};
