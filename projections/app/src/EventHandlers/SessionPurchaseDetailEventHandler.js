module.exports = function(rsRepository, moment, logger) {
  return function SessionPurchaseDetailEventHandler() {
    logger.info('SessionPurchaseDetailEventHandler started up');

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event');
      let detail = {
        id: event.id,
        sessions: event.sessions
      };
      return await rsRepository.save('purchaseDetails', detail);
    }

    return {
      handlerName: 'SessionPurchaseDetailEventHandler',
      sessionsPurchased
    };
  };
};
