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
      const purchase = state.buildPurchase(event.id);
      return await persistence.saveState(state, purchase);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event in SessionsPurchasedEventHandler');
      const purchaseId = state.processFundedAppointment(event);
      const purchase = state.buildPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }

    async function unfundedAppointmentFundedByClient(event) {
      logger.info('handling unfundedAppointmentFundedByClient event in SessionsPurchasedEventHandler');
      const purchaseId = state.processFundedAppointment(event);
      const purchase = state.buildPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }

    async function sessionsRefunded(event) {
      logger.info('handling sessionsRefunded event in SessionsPurchasedEventHandler');
      const purchaseIds = state.refundSessions(event);
      const purchases = purchaseIds.map(x => state.buildPurchase(x));
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    // beginning to try and reconcile a past appointment update. not done obviously
    // async function appointmentUpdated(event) {
    //   logger.info(`handling appointmentUpdated event in SessionsPurchasedEventHandler`);
    //   const subEvent = Object.assign({}, event);
    //   delete subEvent.eventName;
    //   delete subEvent.endTime;
    //   delete subEvent.notes;
    //   delete subEvent.entityName;
    //   const oldAppointment = state.innerState.appointments.find(x => x.id === subEvent.id);
    //   if (oldAppointment.clients !== subEvent.clients
    // || oldAppointment.appointmentType !== subEvent.appointmentType) {
    //
    //   }
    //   state.innerState.appointments = state.innerState.appointments.map(x =>
    //     x.id === subEvent.id
    //       ? subEvent
    //       : x);
    //   await persistence.saveState(state);
    // }

    let output = {
      handlerType: 'sessionsPurchasedEventHandler',
      handlerName: 'sessionsPurchasedEventHandler',
      unfundedAppointmentFundedByClient,
      appointmentAttendedByClient,
      sessionsPurchased,
      sessionsRefunded
    };

    return Object.assign(output,
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName));
  };
};
