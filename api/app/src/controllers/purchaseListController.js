module.exports = function(rsRepository, logger) {
  let fetchPurchases = async function(ctx) {
    logger.debug('arrived at sessionsPurchaseList.fetchPurchases');

    try {
      const clientPurchases = await rsRepository.getById(ctx.params.clientId, 'purchases');

      ctx.body = clientPurchases.purchases ? clientPurchases.purchases : [];
      
      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };

  let fetchPurchaseDetails = async function(ctx) {
    logger.debug('arrived at sessionsPurchaseList.fetchPurchaseDetails');

    try {
      const purchaseDetails = await rsRepository.getById(ctx.params.purchaseId, 'purchaseDetails');

      ctx.body = purchaseDetails ? purchaseDetails.sessions : [];
      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchPurchases,
    fetchPurchaseDetails
  };
};
