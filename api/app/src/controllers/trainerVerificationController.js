module.exports = function(
  rsRepository,
  eventstore,
  notificationListener,
  notificationParser,
  commands,
  moment,
  uuid,
  logger,
) {
  let fetchUnverifiedAppointments = async function(ctx) {
    logger.debug('arrived at trainerVerification.fetchUnverifiedAppointments');
    rsRepository = await rsRepository;

    try {
      let sql = 'SELECT * from "unpaidAppointments" where';
      // if (ctx.state.user.role !== 'admin') {
      sql += ` id = '${ctx.state.user.trainerId}'`;
      // } else {
      //   sql += ` id <> '00000000-0000-0000-0000-000000000001'`;
      // }
      const query = await rsRepository.query(sql);
      const result = query.reduce(
        (ag, x) => ag.concat(x.unpaidAppointments),
        [],
      );
      ctx.body = result.filter(x => !x.verified);
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  let verifyAppointments = async function(ctx) {
    logger.debug('arrived at trainerVerification.verifyAppointments');

    try {
      let payload = ctx.request.body;
      payload.commandName = 'verifyAppointments';
      payload.verifiedDate = moment().format('MM/DD/YYYY');
      payload.trainerId = ctx.state.user.trainerId;
      const continuationId = uuid.v4();
      let notificationPromise = await notificationListener(continuationId);
      const command = commands.verifyAppointmentsCommand(payload);
      await eventstore.commandPoster(
        command,
        'verifyAppointments',
        continuationId,
      );

      const result = await notificationParser(notificationPromise);
      ctx.body = result.body;
      ctx.status = result.status;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchUnverifiedAppointments,
    verifyAppointments,
  };
};
