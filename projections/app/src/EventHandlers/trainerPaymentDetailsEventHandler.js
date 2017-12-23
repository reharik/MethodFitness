module.exports = function(trainerPaymentDetailsPersistence,
                           appointmentWatcher,
                          trainerWatcher,
                          clientWatcher,
                          metaLogger,
                          logger) {

  return async function trainerPaymentDetailsEventHandler() {

    const persistence = trainerPaymentDetailsPersistence();
    let state = await persistence.initializeState();
    logger.info('trainerPaymentDetailsEventHandler started up');

    async function trainersNewClientRateSet(event) {
      state.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await persistence.saveState(state);
    }

    async function trainersClientRatesUpdated(event) {
      event.clientRates.forEach(x => state.updateTRC({
        trainerId: event.trainerId,
        clientId: x.clientId,
        rate: x.rate
      }));

      return await persistence.saveState(state);
    }

    async function trainersClientRateChanged(event) {
      state.updateTCR(event);

      return await persistence.saveState(state);
    }

    async function trainerClientRemoved(event) {
      state.removeTCR(event);

      return await persistence.saveState(state);
    }

    async function sessionsPurchased(event) {
      event.sessions.forEach(e => state.addSession(e));
      return await persistence.saveState(state);
    }

    async function trainerPaid(event) {
      const payment = state.processPaidAppointments(event);
      return await persistence.saveState(state, payment, event.trainerId);
    }

    async function sessionsRefunded(event) {
      state.refundSessions(event);
      return await persistence.saveState(state);
    }

    async function sessionReturnedFromPastAppointment(event) {
      state.sessionReturnedFromPastAppointment(event);
      await persistence.saveState(state);
    }

    async function appointmentAttendedByClient(event) {
      state.appointmentAttendedByClient(event);
      await persistence.saveState(state);
    }

    let output = metaLogger({
      handlerType: 'trainerPaymentDetailsEventHandler',
      handlerName: 'trainerPaymentDetailsEventHandler',
      trainerPaid,
      sessionsPurchased,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainersNewClientRateSet,
      trainersClientRatesUpdated,
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      appointmentAttendedByClient
    }, 'trainerPaymentDetailsEventHandler');

    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
