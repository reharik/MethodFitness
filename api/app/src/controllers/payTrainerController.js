module.exports = function(rsRepository, logger) {
  let fetchVerifiedAppointments = async function(ctx) {
    logger.debug('arrived at payTrainList.fetchVerifiedAppointments');

    try {
      let sql = `SELECT "unpaidAppointments" from "unpaidAppointments" where id = '${ctx.params.trainerId}'`;

      const result = await rsRepository.query(sql);

      ctx.body = result.filter(x => x.verified);
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchVerifiedAppointments
  };
};
