module.exports = function(
  rsRepository,
  notificationListener,
  notificationParser,
  eventstore,
  commands,
  logger,
  uuid,
) {
  let addLocation = async function(ctx) {
    logger.debug('arrived at location.addLocation');
    await processMessage(ctx, 'addLocation');
  };

  let updateLocation = async function(ctx) {
    logger.debug('arrived at location.updateLocation');
    await processMessage(ctx, 'updateLocation');
  };

  let archiveLocation = async function(ctx) {
    logger.debug('arrived at location.archiveLocation');

    await processMessage(
      ctx,
      ctx.request.body.archived ? 'unArchiveLocation' : 'archiveLocation',
    );
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

  let getLocation = async function(ctx) {
    rsRepository = await rsRepository;
    let location;
    location = await rsRepository.getById(ctx.params.locationId, 'location');

    ctx.status = 200;
    ctx.body = location;
  };

  return {
    addLocation,
    updateLocation,
    archiveLocation,
    getLocation,
  };
};
