/**
 * Created by parallels on 7/16/15.
 */

module.exports = function(rsRepository, moment, metaLogger, logger) {
  return function HeathCheckEventHandler() {
    logger.info('HeathCheckEventHandler started up');
    async function healthCheck(event) {
      rsRepository = await rsRepository;
      return await rsRepository.saveQuery(
        `INSERT INTO "healthcheck" ("id", "healthcheck") values('${
          event.healthCheckId
        }', '${event.healthCheck}');`,
      );
    }

    return metaLogger(
      {
        handlerName: 'HeathCheckEventHandler',
        healthCheck,
      },
      'HeathCheckHandler',
    );
  };
};
