module.exports = function(trainerPaymentDetailsPersistence,
                          metaLogger,
                          statefulEventHandler,
                          logger) {

  return async function trainerPaymentDetailsEventHandler() {

    const persistence = trainerPaymentDetailsPersistence();
    let initialState = statefulEventHandler.getInitialState({
      paidAppointments: []
    });
    let state = await persistence.initializeState(initialState);
    const baseHandler = statefulEventHandler.baseHandler(state, persistence, 'trainerPaymentDetailsBaseHandler');

    logger.info('trainerPaymentDetailsEventHandler started up');

    async function trainerPaid(event) {
      const payment = state.trainerPaid(event);
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
