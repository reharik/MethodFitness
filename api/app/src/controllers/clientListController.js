module.exports = function(rsRepository, logger) {
  let fetchAllClients = async function(ctx) {
    logger.debug('arrived at clientlist.fetchAllClients');
    rsRepository = await rsRepository;

    try {
      let sql = 'SELECT * from "client";';
      if (ctx.state.user.role !== 'admin') {
        const trainer = await rsRepository.getById(
          ctx.state.user.trainerId,
          'trainer',
        );
        sql = `SELECT * from "client" where id in (${trainer.clients.map(
          item => `'${item}'`,
        )});`;
      }
      const query = await rsRepository.query(sql);
      ctx.body = { clients: query };
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  // don't really need this method. could return all and let fe filter
  let fetchClients = async function(ctx) {
    logger.debug('arrived at clientlist.fetchClients');
    rsRepository = await rsRepository;

    try {
      let sql = 'SELECT * from "client" where not "archived"';
      if (ctx.state.user.role !== 'admin') {
        const trainer = await rsRepository.getById(
          ctx.state.user.trainerId,
          'trainer',
        );
        sql += ` AND id in (${trainer.clients.map(item => `'${item}'`)});`;
      }
      const query = await rsRepository.query(sql);
      ctx.body = { clients: query };
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchClients,
    fetchAllClients,
  };
};
