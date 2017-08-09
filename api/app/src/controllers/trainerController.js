

module.exports = function(
  rsRepository,
  notificationListener,
  notificationParser,
  eventstore,
  commands,
  uuid,
  logger,
  authentication
) {
  let hireTrainer = async function(ctx) {
    logger.debug('arrived at trainer.hireTrainer');
    const payload = ctx.request.body;
    payload.credentials.password = authentication.createPassword(payload.credentials.password);
    const result = await processMessage(payload, 'hireTrainer');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateTrainerInfo = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerInfo');
    const result = await processMessage(ctx.request.body, 'updateTrainerInfo');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateTrainerContact = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerContact');
    const result = await processMessage(ctx.request.body, 'updateTrainerContact');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateTrainerAddress = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerAddress');

    const result = await processMessage(ctx.request.body, 'updateTrainerAddress');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateTrainerPassword = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerPassword');
    const payload = ctx.request.body;
    payload.password = authentication.createPassword(payload.password);
    const result = await processMessage(payload, 'updateTrainerPassword');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateTrainersClients = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainersClients');

    const result = await processMessage(ctx.request.body, 'updateTrainersClients');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateTrainersClientRates = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainersClientRates');

    const result = await processMessage(ctx.request.body, 'updateTrainersClientRates');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let archiveTrainer = async function(ctx) {
    logger.debug('arrived at trainer.archiveTrainer');

    const result = await processMessage(
      ctx.request.body,
      ctx.request.body.archived ? 'unArchiveTrainer' : 'archiveTrainer'
    );

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let processMessage = async function(payload, commandName) {
    const continuationId = uuid.v4();
    let notificationPromise = await notificationListener(continuationId, commandName);

    const command = commands[commandName + 'Command'](payload);
    await eventstore.commandPoster(command, commandName, continuationId);

    return await notificationParser(notificationPromise);
  };

  let getTrainer = async function(ctx) {
    const trainer = await rsRepository.getById(ctx.params.id, 'trainer');
    ctx.status = 200;
    ctx.body = trainer;
  };


  let getTrainerClientRates = async function(ctx) {
    const trainer = await rsRepository.getById(ctx.params.id, 'trainer');
    ctx.status = 200;
    ctx.body = trainer.trainerClientRates
      ? trainer.trainerClientRates.map(x => ({trainerId: trainer.id, clientId: x.clientId, rate: x.rate}))
      : [];
  };

  return {
    hireTrainer,
    updateTrainerInfo,
    updateTrainerContact,
    updateTrainerAddress,
    updateTrainerPassword,
    updateTrainersClients,
    updateTrainersClientRates,
    archiveTrainer,
    getTrainerClientRates,
    getTrainer
  };
};
