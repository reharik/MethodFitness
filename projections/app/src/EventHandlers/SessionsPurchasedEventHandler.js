module.exports = function(rsRepository, moment, logger) {
  return function SessionsPurchasedEventHandler() {
    logger.info('SessionsPurchasedEventHandler started up');

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event');
      let clientPurchases = await rsRepository.getById(event.clientId, 'purchases');
      clientPurchases = clientPurchases.purchases ? clientPurchases : {id: event.clientId, purchases:[]};
      clientPurchases.purchases.push({
        purchaseTotal: event.purchaseTotal,
        purchaseDate: event.purchaseDate,
        purchaseId: event.id,
        clientId: event.clientId
      });
      return await rsRepository.save('purchases', clientPurchases);
    }

    return {
      handlerName: 'SessionsPurchasedEventHandler',
      sessionsPurchased
    };
  };
};
