module.exports = function(rsRepository, logger) {
  let fetchAllClients = async function(ctx) {
    logger.debug('arrived at clientlist.fetchAllClients');

    try {
      let sql = 'SELECT * from "client";';
      if (ctx.state.user.role !== 'admin') {
        const trainer = await rsRepository.getById(ctx.state.user.id, 'trainer');
        sql = `SELECT * from "client" where id in (${trainer.clients.map(item => `'${item}'`)});`;
      }
      const query = await rsRepository.query(sql);
      ctx.body = {clients: query};
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  let fetchClients = async function(ctx) {
    logger.debug('arrived at clientlist.fetchClients');

    try {
      let sql = 'SELECT * from "client" where not "archived";';
      // if (ctx.state.user.role !== 'admin') {
      //     const trainer = await rsRepository.getById(ctx.state.user.id, 'trainer');
      //     sql = `SELECT * from "client" where  not "archived"
      // AND id in (${trainer.clients.map(item => `'${item}'`)})`;
      // }
      const query = await rsRepository.query(sql);
      ctx.body = {clients: query};
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }

  };

  return {
    fetchClients,
    fetchAllClients
  };
};
