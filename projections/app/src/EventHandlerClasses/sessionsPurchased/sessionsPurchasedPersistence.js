module.exports = function(rsRepository, sessionsPurchasedState, logger) {

  return function() {
    async function initializeState() {
      logger.info('Initializing state in sessionsPurchasedPersistence');
      let state = await rsRepository
        .getAggregateViewMeta('sessionsPurchased', '00000000-0000-0000-0000-000000000001');

      if (!state.purchases) {
        state = sessionsPurchasedState();

        await rsRepository.insertAggregateMeta('sessionsPurchased', state.innerState);
      } else {
        state = sessionsPurchasedState(state);
      }
      return state;
    }

    async function saveState(state, purchase) {
      logger.info('Saving state in sessionsPurchasedPersistence');
      let sessionsPurchased = {};
      if (purchase) {
        sessionsPurchased = await rsRepository.getById(purchase.clientId, 'sessionsPurchased');
        if (!sessionsPurchased.id) {
          sessionsPurchased = {id: purchase.clientId, purchases: []};
        }
        sessionsPurchased.purchases = sessionsPurchased.purchases.filter(x => x.purchaseId !== purchase.purchaseId);
        sessionsPurchased.purchases.push(purchase);
      }

      return await rsRepository.saveAggregateView(
        'sessionsPurchased',
        state.innerState,
        sessionsPurchased);
    }
    // beginning to try and reconcile a past appointment update. not done obviously
    // async function saveUpdatedAppointment(state, appointmentId) {
    //   logger.info('Saving state in sessionsPurchasedPersistence');
    //   let sessionsPurchased = {};
    //   if (purchase) {
    //     sessionsPurchased = await rsRepository.getById(purchase.clientId, 'sessionsPurchased');
    //     if (!sessionsPurchased.id) {
    //       sessionsPurchased = {id: purchase.clientId, purchases: []};
    //     }
    //     sessionsPurchased.purchases = sessionsPurchased.purchases.filter(x => x.purchaseId !== purchase.purchaseId);
    //     sessionsPurchased.purchases.push(purchase);
    //   }
    //
    //   return await rsRepository.saveAggregateView(
    //     'sessionsPurchased',
    //     state.innerState,
    //     sessionsPurchased);
    // }

    return {
      initializeState,
      saveState
    };
  };
};
