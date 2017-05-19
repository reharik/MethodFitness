module.exports = function(rsRepository, logger) {
  let fetchPurchases = async function(ctx) {
    logger.debug('arrived at sessionsPurchaseList.fetchPurchases');

    try {
      let sql = `SELECT * from "purchase" where "client" = '${ctx.params.id}';`;
      const query = await rsRepository.query(sql);

      ctx.body = {purchases: query};
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
