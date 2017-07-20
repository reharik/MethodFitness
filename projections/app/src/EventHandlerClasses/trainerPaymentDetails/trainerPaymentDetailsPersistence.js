module.exports = function(rsRepository, trainerPaymentDetailsState, logger) {
  return function() {

    async function initializeState() {
      logger.info('Initializing state in trainerPaymentDetailsPersistence');
      let state = await rsRepository
        .getAggregateViewMeta('trainerPaymentDetails', '00000000-0000-0000-0000-000000000001');

      if (!state.trainers) {
        state = trainerPaymentDetailsState();

        await rsRepository.insertAggregateMeta('trainerPaymentDetails', state.innerState);
      } else {
        state = trainerPaymentDetailsState(state);
      }
      return state;
    }

    async function saveState(state, payment, trainerId) {
      logger.info('Saving state in trainerPaymentDetailsPersistence');
      let trainerPayments = {};
      if (trainerId) {
        trainerPayments = await rsRepository.getById(trainerId, 'trainerPaymentDetails');
        if (!trainerPayments.id) {
          trainerPayments = {id: trainerId, payments: []};
        }
        trainerPayments.payments.push(payment);
      }
      state.paidAppointments = [];
      return await rsRepository.saveAggregateView(
        'trainerPaymentDetails',
        state.innerState,
        trainerPayments);
    }

    return {
      initializeState,
      saveState
    };
  };
};
