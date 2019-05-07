module.exports = function(
  eventRepository,
  metaLogger,
  logger,
  defaultClientRates,
) {
  return function defaultClientRatesWorkflow() {
    async function handleCommand(cmd, continuationId, funcName) {
      let defaultClientRatesInstance = await eventRepository.getById(
        defaultClientRates,
        cmd.defaultClientRatesId,
      );
      defaultClientRatesInstance[funcName](cmd);

      logger.trace(JSON.stringify(defaultClientRatesInstance));
      logger.info('saving defaultClientRateInstance');

      await eventRepository.save(defaultClientRatesInstance, {
        continuationId,
      });
      return { defaultClientRatesId: defaultClientRatesInstance.state._id };
    }

    async function updateDefaultClientRates(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'updateDefaultClientRates');
    }

    return metaLogger(
      {
        handlerName: 'defaultClientRatesWorkflow',
        updateDefaultClientRates,
      },
      'defaultClientRatesWorkflow',
    );
  };
};
