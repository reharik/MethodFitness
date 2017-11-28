module.exports = function(trainerPaymentDetailsPersistence,
                           appointmentWatcher,
                          trainerWatcher,
                          clientWatcher, logger) {

  return async function trainerPaymentDetailsEventHandler() {

    const persistence = trainerPaymentDetailsPersistence();
    let state = await persistence.initializeState();
    logger.info('trainerPaymentDetailsEventHandler started up');

    async function trainersNewClientRateSet(event) {
      logger.info('handling trainersNewClientRateSet event in trainerPaymentDetailsEventHandler');
      state.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await persistence.saveState(state);
    }

    async function trainersClientRatesUpdated(event) {
      logger.info('handling trainersClientRatesUpdated event in trainerPaymentDetailsEventHandler');
      event.clientRates.forEach(x => state.updateTRC({
        trainerId: event.trainerId,
        clientId: x.clientId,
        rate: x.rate
      }));

      return await persistence.saveState(state);
    }

    async function trainersClientRateChanged(event) {
      logger.info('handling trainersClientRateChanged event in trainerPaymentDetailsEventHandler');
      state.updateTCR(event);

      return await persistence.saveState(state);
    }

    async function trainerClientRemoved(event) {
      logger.info('handling trainerClientRemoved event in trainerPaymentDetailsEventHandler');
      state.removeTCR(event);

      return await persistence.saveState(state);
    }

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event in trainerPaymentDetailsEventHandler');
      event.sessions.forEach(e => state.addSession(e));
      return await persistence.saveState(state);
    }

    async function trainerPaid(event) {
      logger.info('handling trainerPaid event in trainerPaymentDetailsEventHandler');
      const payment = state.processPaidAppointments(event);
      return await persistence.saveState(state, payment, event.trainerId);
    }

    async function sessionsRefunded(event) {
      logger.info('handling sessionsRefunded event in trainerPaymentDetailsEventHandler');
      state.refundSessions(event);
      return await persistence.saveState(state);
    }

    let output = {
      handlerType: 'trainerPaymentDetailsEventHandler',
      handlerName: 'trainerPaymentDetailsEventHandler',
      trainerPaid,
      sessionsPurchased,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainersNewClientRateSet,
      trainersClientRatesUpdated,
      sessionsRefunded
    };

    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
