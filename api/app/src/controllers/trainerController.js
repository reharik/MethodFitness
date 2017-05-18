'use strict';

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
  var hireTrainer = async function(ctx) {
    logger.debug('arrived at trainer.hireTrainer');
    const payload = ctx.request.body;
    payload.credentials.password = authentication.createPassword(payload.credentials.password);
    const result = await processMessage(payload, 'hireTrainer');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var updateTrainerInfo = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerInfo');
    const result = await processMessage(ctx.request.body, 'updateTrainerInfo');
    console.log('==========result=========');
    console.log(result);
    console.log('==========END result=========');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var updateTrainerContact = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerContact');
    const result = await processMessage(ctx.request.body, 'updateTrainerContact');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var updateTrainerAddress = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerAddress');

    const result = await processMessage(ctx.request.body, 'updateTrainerAddress');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var updateTrainerPassword = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainerPassword');
    const payload = ctx.request.body;
    payload.password = authentication.createPassword(payload.password);
    const result = await processMessage(payload, 'updateTrainerPassword');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var updateTrainersClients = async function(ctx) {
    logger.debug('arrived at trainer.updateTrainersClients');

    const result = await processMessage(ctx.request.body, 'updateTrainersClients');

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var archiveTrainer = async function(ctx) {
    logger.debug('arrived at trainer.archiveTrainer');

    const result = await processMessage(
      ctx.request.body,
      ctx.request.body.archived ? 'unArchiveTrainer' : 'archiveTrainer'
    );

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var processMessage = async function(payload, commandName) {
    const continuationId = uuid.v4();
    let notificationPromise = notificationListener(continuationId, commandName);

    const command = commands[commandName + 'Command'](payload);
    await eventstore.commandPoster(command, commandName, continuationId);

    const notification = await notificationPromise;
    return notificationParser(notification);
  };

  var getTrainer = async function(ctx) {
    const trainer = await rsRepository.getById(ctx.params.id, 'trainer');
    ctx.status = 200;
    ctx.body = trainer;
  };

  return {
    hireTrainer,
    updateTrainerInfo,
    updateTrainerContact,
    updateTrainerAddress,
    updateTrainerPassword,
    updateTrainersClients,
    archiveTrainer,
    getTrainer
  };
};
