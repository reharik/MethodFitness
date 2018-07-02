module.exports = function(eventstore, config, metaLogger, uuid, logger) {
  return function healthcheckWorkflow() {
    async function healthcheck(cmd) {
      logger.info(`posting healthcheck: ${cmd.healthcheck}`);

      let configs = config.configs.children.eventstore;
      const credentialsForAllEventsStream = new eventstore.UserCredentials(
        configs.systemUsers.admin,
        configs.systemUsers.adminPassword,
      );

      const connection = await eventstore.gesConnection;

      let event = eventstore.createJsonEventData(
        uuid.v4(),
        cmd,
        { eventName: healthcheck, streamType: 'healthcheck' },
        'healthcheck',
      );

      await connection.appendToStream(
        'event',
        eventstore.expectedVersion.any,
        [event],
        credentialsForAllEventsStream,
      );
    }

    return metaLogger(
      {
        handlerName: 'healthcheckWorkflow',
        healthcheck,
      },
      'healthcheckWorkflow',
    );
  };
};
