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
  let fetchVerifiedAppointments = async function(ctx) {
    logger.debug('arrived at payTrainer.fetchVerifiedAppointments');
    rsRepository = await rsRepository;
    try {
      let sql = `SELECT * from "unpaidAppointments" where id = '${
        ctx.params.trainerId
      }'`;
      const query = await rsRepository.query(sql);
      const result = query[0];
      let body = {};
      if (result) {
        body = result.appointments.filter(x => x.verified);
      }
      ctx.body = body;
      ctx.status = 200;
    } catch (ex) {
      throw ex;
    }
  };

  let payTrainer = async function(ctx) {
    logger.debug('arrived at payTrainer.payTrainer');

    try {
      let payload = ctx.request.body;
      payload.commandName = 'payTrainer';
      payload.datePaid = moment().format('MM/DD/YYYY');
      const continuationId = uuid.v4();
      let notificationPromise = await notificationListener(continuationId);
      const command = commands.payTrainerCommand(payload);
      await eventstore.commandPoster(command, 'payTrainer', continuationId);

      const result = await notificationParser(notificationPromise);
      ctx.body = result.body;
      ctx.status = result.status;
    } catch (ex) {
      throw ex;
    }
  };

  return {
    fetchVerifiedAppointments,
    payTrainer,
  };
};
