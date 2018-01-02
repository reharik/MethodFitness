module.exports = function(rsRepository, sessionsPurchasedState, logger) {

  return function() {
    async function initializeState(initialState) {
      logger.info('Initializing state in sessionsPurchasedPersistence');
      let state = await rsRepository
        .getAggregateViewMeta('sessionsPurchased', '00000000-0000-0000-0000-000000000001');

      if (!state.trainers) {
        state = initialState;

        await rsRepository.insertAggregateMeta('sessionsPurchased', state);
      } return sessionsPurchasedState(state);
    }

    async function saveState(state, purchase) {
      logger.info('Saving state in sessionsPurchasedPersistence');
      let sessionsPurchased = {};
      if (purchase) {
        sessionsPurchased = await rsRepository.getById(purchase.clientId, 'sessionsPurchased');
        if (!sessionsPurchased.clientId) {
          sessionsPurchased = {clientId: purchase.clientId, purchases: []};
        }
        //remove the specific purchase and then re-add the newly amended one
        sessionsPurchased.purchases = sessionsPurchased.purchases.filter(x => x.purchaseId !== purchase.purchaseId);
        sessionsPurchased.purchases.push(purchase);
      }

      return await rsRepository.saveAggregateView(
        'sessionsPurchased',
        state.innerState,
        sessionsPurchased,
      'clientId');
    }

    return {
      initializeState,
      saveState
    };
  };
};
