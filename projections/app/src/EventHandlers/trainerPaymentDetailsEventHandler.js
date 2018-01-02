module.exports = function(trainerPaymentDetailsPersistence,
                          metaLogger,
                          statefulEventHandler,
                          logger) {

  return async function trainerPaymentDetailsEventHandler() {

    const persistence = trainerPaymentDetailsPersistence();
    let state = await persistence.initializeState();
    const baseHandler = statefulEventHandler(state.innerState, persistence, 'trainerPaymentDetailsEventHandler');
    logger.info('trainerPaymentDetailsEventHandler started up');

    async function trainerPaid(event) {
      const payment = state.processPaidAppointments(event);
      return await persistence.saveState(state, payment, event.trainerId);
    }

    return metaLogger({
      handlerType: 'trainerPaymentDetailsEventHandler',
      handlerName: 'trainerPaymentDetailsEventHandler',
      baseHandlerName: 'trainerPaymentDetailsBaseStateEventHandler',
      baseHandler,
      trainerPaid
    }, 'trainerPaymentDetailsEventHandler');
  };
};
