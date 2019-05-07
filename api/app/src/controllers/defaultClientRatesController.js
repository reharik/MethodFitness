module.exports = function(
  rsRepository,
  notificationListener,
  notificationParser,
  eventstore,
  commands,
  logger,
  uuid,
) {
  let updateDefaultClientRates = async function(ctx) {
    logger.debug('arrived at defaultClientRates.updateDefaultClientRates');
    await processMessage(ctx, 'updateDefaultClientRates');
  };

  const processMessage = async function(ctx, commandName) {
    logger.debug(`api: processing ${commandName}`);
    const payload = ctx.request.body;
    const continuationId = uuid.v4();

    let notificationPromise = await notificationListener(continuationId);
    const command = commands[commandName + 'Command'](payload);

    await eventstore.commandPoster(command, commandName, continuationId);
    const result = await notificationParser(notificationPromise);

    ctx.body = result.body;
    ctx.status = result.status;
    return ctx;
  };

  let getDefaultClientRates = async function(ctx) {
    rsRepository = await rsRepository;
    let defaultClientRates = await rsRepository.query(
      'select * from "defaultClientRates"',
    );

    ctx.status = 200;
    ctx.body = defaultClientRates;
  };

  return {
    updateDefaultClientRates,
    getDefaultClientRates,
  };
};
