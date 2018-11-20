module.exports = function(rsRepository, trainerPaymentDetailsState, logger) {
  return function() {
    async function initializeState(initialState) {
      logger.info('Initializing state in trainerPaymentDetailsPersistence');
      rsRepository = await rsRepository;
      let state = await rsRepository.getAggregateViewMeta(
        'trainerPaymentDetails',
        '00000000-0000-0000-0000-000000000001',
      );
      if (!state.trainers) {
        state = initialState;

        await rsRepository.insertAggregateMeta('trainerPaymentDetails', state);
      }
      return trainerPaymentDetailsState(state);
    }

    async function saveState(state, payment, trainerId) {
      logger.info('Saving state in trainerPaymentDetailsPersistence');
      rsRepository = await rsRepository;
      let trainerPayments = {};
      if (trainerId) {
        trainerPayments = await rsRepository.getById(
          trainerId,
          'trainerPaymentDetails',
        );
        if (!trainerPayments.trainerId) {
          trainerPayments = { trainerId, payments: [] };
        }
        trainerPayments.payments.push(payment);
      }
      return await rsRepository.saveAggregateView(
        'trainerPaymentDetails',
        state.innerState,
        trainerPayments,
        'trainerId',
      );
    }

    return {
      initializeState,
      saveState,
    };
  };
};
