module.exports = function(rsRepository, logger) {
  let fetchUnverifiedAppointments = async function(ctx) {
    logger.debug('arrived at trainerVerificationList.fetchUnverifiedAppointments');

    try {
      let sql = 'SELECT * from "unpaidAppointments" where';
      if (ctx.state.user.role !== 'admin') {
        sql += ` id = '${ctx.state.user.id}'`;
      } else {
        sql += ` id <> '00000000-0000-0000-0000-000000000001'`;
      }
      const query = await rsRepository.query(sql);
      ctx.body = query.filter(x => !x.verified);
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchUnverifiedAppointments
  };
};
