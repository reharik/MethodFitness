module.exports = function(rsRepository, logger) {
  let fetchPurchases = async function(ctx) {
    logger.debug('arrived at sessionsPurchaseList.fetchPurchases');

    try {
      const clientPurchases = await rsRepository.getById(ctx.params.clientId, 'sessionsPurchased');

      ctx.body = clientPurchases.purchases ? clientPurchases.purchases : [];

      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchPurchases
  };
};
