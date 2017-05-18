module.exports = function(dispatchNotification,
                          eventHelperRepository,
                          appfuncs,
                          R,
                          logger) {

  return async function (event, handlerName, hnadlerFunction) {
    var fh      = appfuncs.functionalHelpers;
    try {
      logger.trace(handlerName + ' ' + JSON.stringify(event));
      const isIdempotent = await eventHelperRepository.checkIdempotency(fh.getSafeValue('commitPosition', event), handlerName);
      logger.trace('message for ' + handlerName + ' isIdempotent ' + JSON.stringify(isIdempotent));
      if (!isIdempotent.isIdempotent) {
        throw new Error("item has already been processed");
      }

      var continuationId = R.view(R.lensProp('continuationId'), fh.getSafeValue('metadata', event));
      var handlerResult = await hnadlerFunction(fh.getSafeValue('data', event), continuationId);
      logger.trace('message for ' + handlerName + ' was handled ' + event.eventName);

      await eventHelperRepository.recordEventProcessed(fh.getSafeValue('commitPosition', event), handlerName);
      logger.trace('message for ' + handlerName + ' recorded as processed ' + event.eventName);

      await dispatchNotification("Success", event, handlerResult);
      logger.trace('message for ' + handlerName + ' notification disaptched');

    } catch (ex) {
      logger.debug(`An exception in event workflow thrown, this may just be non idempotent catch though`);
      logger.debug(ex);

      // here we need to determin if this is a catastrophic failure, and if so best to throw
      // also need to figure out how to parse the exception to get a usable error
      await dispatchNotification("Failure", event, ex.message, ex)
    }
  }
};