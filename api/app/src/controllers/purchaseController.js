module.exports = function(rsRepository, notificationListener, notificationParser, eventstore, commands, logger, uuid) {
  let purchase = async function(ctx) {
    logger.debug('arrived at sessionsPurchase.purchases');
    let payload = ctx.request.body;
    payload.totalFullHours = parseInt(payload.fullHourTenPack) * 10 + parseInt(payload.fullHour);
    payload.totalHalfHours = parseInt(payload.halfHourTenPack) * 10 + parseInt(payload.halfHour);
    payload.totalPairs = parseInt(payload.pairTenPack) * 10 + parseInt(payload.pair);
    await processMessage(ctx, 'purchase', payload);
  };

  let updatePurchase = async function(ctx) {
    // will want logic here for only allowing admin and distinguishing
    // between accident and refund.
    logger.debug('arrived at sessionsPurchase.updatePurchase');
    await processMessage(ctx, 'updatePurchase', ctx.request.body);
  };

  let refundSessions = async function(ctx) {
    // will want logic here for only allowing admin and distinguishing
    // between accident and refund.
    logger.debug('arrived at sessionsPurchase.refundSessions');
    await processMessage(ctx, 'refundSessions', ctx.request.body);
  };

  let processMessage = async function(ctx, commandName, payload) {
    logger.debug(`api: processing ${commandName}`);
    const continuationId = uuid.v4();
    let notificationPromise = await notificationListener(continuationId);

    const command = commands[commandName + 'Command'](payload);
    await eventstore.commandPoster(command, commandName, continuationId);

    const result = await notificationParser(notificationPromise);

    ctx.body = result.body;
    ctx.status = result.status;
    return ctx;
  };

  let fetchPurchase = async function(ctx) {
    let _purchase = await rsRepository.getById(ctx.params.id, 'purchase');

    ctx.status = 200;
    ctx.body = _purchase;
  };

  return {
    purchase,
    updatePurchase,
    refundSessions,
    fetchPurchase
  };
};
