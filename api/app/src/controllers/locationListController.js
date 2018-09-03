module.exports = function(rsRepository, logger) {
  let fetchAllLocations = async function(ctx) {
    logger.debug('arrived at locationlist.fetchAllLocations');

    try {
      let sql = 'SELECT * from "location";';
      const query = await rsRepository.query(sql);
      ctx.body = { locations: query };
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchAllLocations,
  };
};
