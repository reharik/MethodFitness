/**
 * Created by parallels on 7/16/15.
 */

module.exports = function(rsRepository, moment, metaLogger, logger) {
  return function DefaultClientRatesEventHandler() {
    logger.info('DefaultClientRatesEventHandler started up');

    async function defaultClientRatesUpdated(event) {
      rsRepository = await rsRepository;

      return await rsRepository.save(
        'defaultClientRates',
        event,
        event.defaultClientRatesId,
      );
    }

    return metaLogger(
      {
        handlerName: 'DefaultClientRatesEventHandler',
        defaultClientRatesUpdated,
      },
      'DefaultClientRatesEventHandler',
    );
  };
};
