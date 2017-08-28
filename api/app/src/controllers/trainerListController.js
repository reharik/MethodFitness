module.exports = function(rsRepository, logger) {
  let fetchTrainers = async function(ctx) {
    logger.debug('arrived at trainerlist.fetchTrainers');

    try {
      let sql = 'SELECT * from "trainer" where not "archived"';
      if (ctx.state.user.role !== 'admin') {
        sql += ` and id = '${ctx.state.user.trainerId}'`;
      }
      const query = await rsRepository.query(sql);
      ctx.body = {trainers: query};
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  let fetchAllTrainers = async function(ctx) {
    logger.debug('arrived at trainerlist.fetchAllTrainers');
    try {
      let query = [];
      if (ctx.state.user.role === 'admin') {
        query = await rsRepository.query('SELECT * from "trainer";');
      }
      ctx.body = {trainers: query};
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchTrainers,
    fetchAllTrainers
  };
};
