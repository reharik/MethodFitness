module.exports = function(moment,
                          sessionsPurchasedPersistence,
                          statefulEventHandler,
                          metaLogger,
                          logger) {

  return async function sessionsPurchasedEventHandler() {

    const persistence = sessionsPurchasedPersistence();
    let state = await persistence.initializeState();
    const baseHandler = statefulEventHandler(state.innerState, persistence, 'SessionsPurchasedEventHandler');
    logger.info('SessionsPurchasedEventHandler started up');

    async function fundedAppointmentAttendedByClient(event) {
      const purchase = state.fundedAppointmentAttendedByClient(event);
      return await persistence.saveState(state, purchase);
    }

    async function pastAppointmentUpdated(event) {
      const purchaseIds = state.pastAppointmentUpdated(event);
      const purchases = purchaseIds.map(x => state.getPurchase(x));
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    async function sessionsPurchased(event) {
      const purchase = state.sessionsPurchased(event);
      return await persistence.saveState(state, purchase);
    }

    async function sessionsRefunded(event) {
      const purchases = state.refundSessions(event);
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    async function sessionReturnedFromPastAppointment(event) {
      const purchase = state.returnSessionsFromPastAppointment(event);
      await persistence.saveState(state, purchase);
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(event) {
      let purchase = state.transferSessionFromPastAppointment(event);
      await persistence.saveState(state, purchase);
    }

    async function trainerPaid() {
      state.trainerPaid();
      return await persistence.saveState(state);
    }

/*
    async function unfundedAppointmentFundedByClient(event) {
      logger.info('handling unfundedAppointmentFundedByClient event in SessionsPurchasedEventHandler');
      const purchaseId = state.processFundedAppointment(event);
      const purchase = state.getPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }
*/

    return metaLogger({
      handlerType: 'sessionsPurchasedEventHandler',
      handlerName: 'sessionsPurchasedEventHandler',
      baseHandlerName: 'sessionsPurchasedBaseStateEventHandler',
      baseHandler,
      fundedAppointmentAttendedByClient,
      pastAppointmentUpdated,
      sessionsPurchased,
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
      trainerPaid
    }, 'sessionPurchasedEventHandler');
  };
};
