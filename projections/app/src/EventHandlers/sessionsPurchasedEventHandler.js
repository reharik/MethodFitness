module.exports = function(moment,
                          sessionsPurchasedPersistence,
                          appointmentWatcher,
                          trainerWatcher,
                          clientWatcher,
                          logger) {

  return async function sessionsPurchasedEventHandler() {

    const persistence = sessionsPurchasedPersistence();
    let state = await persistence.initializeState();
    logger.info('SessionsPurchasedEventHandler started up');

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event in SessionsPurchasedEventHandler');
      state.sessionsPurchased(event);
      const purchase = state.getPurchase(event.purchaseId);
      return await persistence.saveState(state, purchase);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event in SessionsPurchasedEventHandler');
      const purchaseId = state.processFundedAppointment(event);
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
      logger.info('handling sessionsRefunded event in SessionsPurchasedEventHandler');
      const purchaseIds = state.refundSessions(event);
      const purchases = purchaseIds.map(x => state.getPurchase(x));
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    async function sessionReturnedFromPastAppointment(event) {
      logger.info('handling sessionReturnedFromPastAppointment event in SessionsPurchasedEventHandler');
      const purchase = await persistence.getPreviousPurchase(event.clientId, event.sessionId);
      //mutating state of purchase
      state.refundSessionsFromPastAppointment(event, purchase);
      await persistence.saveState(state, purchase);
    }

    async function pastAppointmentRemoved(event) {
      state.pastAppointmentRemoved(event);
      return await persistence.saveState(state);
    }

    let output = {
      handlerType: 'sessionsPurchasedEventHandler',
      handlerName: 'sessionsPurchasedEventHandler',
      appointmentAttendedByClient,
      sessionsPurchased,
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      pastAppointmentRemoved
    };

    return Object.assign(output,
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName));
  };
};
