module.exports = function(
  rsRepository,
  notificationListener,
  notificationParser,
  eventstore,
  commands,
  logger,
  uuid,
) {
  let addClient = async function(ctx) {
    logger.debug('arrived at client.addClient');
    await processMessage(ctx, 'addClient');
  };

  let updateClientInfo = async function(ctx) {
    logger.debug('arrived at client.updateClientInfo');
    await processMessage(ctx, 'updateClientInfo');
  };

  let updateClientSource = async function(ctx) {
    logger.debug('arrived at client.updateClientSource');
    await processMessage(ctx, 'updateClientSource');
  };

  let updateClientRates = async function(ctx) {
    logger.debug('arrived at client.updateClientRates');
    await processMessage(ctx, 'updateClientRates');
  };

  let updateClientContact = async function(ctx) {
    logger.debug('arrived at client.updateClientContact');
    await processMessage(ctx, 'updateClientContact');
  };

  let updateClientAddress = async function(ctx) {
    logger.debug('arrived at client.updateClientAddress');
    await processMessage(ctx, 'updateClientAddress');
  };

  let archiveClient = async function(ctx) {
    logger.debug('arrived at client.archiveClient');
    rsRepository = await rsRepository;
    let query = await rsRepository.query('SELECT * from "trainer";');
    const clientId = ctx.request.body.clientId;

    let trainerClients = query
      .filter(x => x.clients && x.clients.some(c => c === clientId))
      .map(x => {
        x.clients.splice(x.clients.indexOf(clientId), 1);
        return { trainerId: x.trainerId, clients: x.clients };
      });

    for (let payload of trainerClients) {
      const command = commands.updateTrainersClientsCommand(payload);
      await eventstore.commandPoster(
        command,
        'updateTrainersClients',
        uuid.v4(),
      );
    }

    await processMessage(
      ctx,
      ctx.request.body.archived ? 'unArchiveClient' : 'archiveClient',
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

  let getClient = async function(ctx) {
    rsRepository = await rsRepository;
    let client;
    if (ctx.state.user.role !== 'admin') {
      const trainer = await rsRepository.getById(
        ctx.state.user.trainerId,
        'trainer',
      );
      if (
        trainer.clients &&
        !trainer.clients.some(x => x === ctx.params.clientId)
      ) {
        throw new Error(
          'Attempt to access client not associated with current trainer',
        );
      }
    }
    client = await rsRepository.getById(ctx.params.clientId, 'client');

    ctx.status = 200;
    ctx.body = client;
  };

  return {
    addClient,
    updateClientInfo,
    updateClientContact,
    updateClientAddress,
    updateClientSource,
    updateClientRates,
    archiveClient,
    getClient,
  };
};
