module.exports = function(rsRepository, moment, logger) {
  return function SessionsPurchasedEventHandler() {
    logger.info('SessionsPurchasedEventHandler started up');

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event');
      let sql = `INSERT INTO "purchase" (
            "id", 
            "client",
            "document"
            ) VALUES (
            '${event.id}',
            '${event.clientId}',
            '${JSON.stringify(event)}')`;
      return await rsRepository.saveQuery(sql);
    }

    return {
      handlerName: 'SessionsPurchasedEventHandler',
      sessionsPurchased
    };
  };
};
