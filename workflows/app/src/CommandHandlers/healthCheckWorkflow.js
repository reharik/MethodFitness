module.exports = function(eventstore, metaLogger, logger, esEvents) {
  return function healthCheckWorkflow() {
    async function healthCheck(cmd) {
      logger.info(`posting healthCheck: ${cmd.healthCheck}`);
      const event = esEvents.healthCheckEvent(cmd);
      await eventstore.commandPoster(
        event,
        'healthCheck',
        cmd.healthCheckId,
        'event',
        'healthCheck',
      );
    }

    return {
      handlerName: 'healthcheckWorkflow',
      healthCheck,
    };
  };
};
