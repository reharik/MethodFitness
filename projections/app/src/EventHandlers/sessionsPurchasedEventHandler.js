module.exports = function(moment,
                          sessionsPurchasedPersistence,
                          appointmentWatcher,
                          trainerWatcher,
                          clientWatcher,
                          metaLogger,
                          logger) {

  return async function sessionsPurchasedEventHandler() {

    const persistence = sessionsPurchasedPersistence();
    let state = await persistence.initializeState();
    logger.info('SessionsPurchasedEventHandler started up');

    async function sessionsPurchased(event) {
      state.sessionsPurchased(event);
      const purchase = state.getPurchase(event.purchaseId);
      return await persistence.saveState(state, purchase);
    }

    async function appointmentAttendedByClient(event) {
      const purchaseId = state.processFundedAppointment(event);
      const purchase = state.getPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }

    async function trainerPaid(event) {
      const purchaseId = state.trainerPaid(event);
      const purchase = state.getPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }

/*
    async function unfundedAppointmentFundedByClient(event) {
      logger.info('handling unfundedAppointmentFundedByClient event in SessionsPurchasedEventHandler');
      const purchaseId = state.processFundedAppointment(event);
      const purchase = state.getPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }
*/

    async function sessionsRefunded(event) {
      const purchaseIds = state.refundSessions(event);
      const purchases = purchaseIds.map(x => state.getPurchase(x));
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    async function sessionReturnedFromPastAppointment(event) {
      const purchase = await persistence.getPreviousPurchase(event.clientId, event.sessionId);
      //mutating state of purchase
      state.returnSessionsFromPastAppointment(event.sessionId, purchase);
      await persistence.saveState(state, purchase);
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(event) {
      const purchase = await persistence.getPreviousPurchase(event.clientId, event.sessionId);
      //mutating state of purchase
      state.transferSessionFromPastAppointment(event, purchase);
      await persistence.saveState(state, purchase);
    }

    async function pastAppointmentUpdated(event) {
      const purchaseIds = state.pastAppointmentUpdated(event);
      const purchases = purchaseIds.map(x => state.getPurchase(x));
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    async function pastAppointmentRemoved(event) {
      state.innerState.appointments = state.innerState.appointments
        .filter(x => x.appointmentId !== event.appointmentId);
    }

    let output = metaLogger({
      handlerType: 'sessionsPurchasedEventHandler',
      handlerName: 'sessionsPurchasedEventHandler',
      appointmentAttendedByClient,
      sessionsPurchased,
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
      pastAppointmentRemoved,
      pastAppointmentUpdated,
      trainerPaid
    }, 'sessionPurchasedEventHandler');

    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
