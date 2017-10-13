module.exports = function(unpaidAppointmentsPersistence,
                          appointmentWatcher,
                          trainerWatcher,
                          clientWatcher, logger) {

  return async function unpaidAppointmentsEventHandler() {

    const persistence = unpaidAppointmentsPersistence();
    let state = await persistence.initializeState();
    logger.info('unpaidAppointmentsEventHandler started up');

    async function trainersNewClientRateSet(event) {
      logger.info('handling trainersNewClientRateSet event in unpaidAppointmentsEventHandler');
      state.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await persistence.saveState(state);
    }

    async function trainersClientRateChanged(event) {
      logger.info('handling trainersClientRateChanged event in unpaidAppointmentsEventHandler');
      state.updateTCR(event);

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

    async function trainerClientRemoved(event) {
      logger.info('handling trainerClientRemoved event in unpaidAppointmentsEventHandler');
      state.removeTCR(event);

      return await persistence.saveState(state);
    }

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event in unpaidAppointmentsEventHandler');
      event.sessions.forEach(e => state.addSession(e));
      return await persistence.saveState(state);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event in unpaidAppointmentsEventHandler');
      const trainerId = state.processFundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      logger.info('handling unfundedAppointmentAttendedByClient event in unpaidAppointmentsEventHandler');
      const trainerId = state.processUnfundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function sessionReturnedFromPastAppointment(event) {
      logger.info('handling sessionReturnedFromPastAppointment event in unpaidAppointmentsEventHandler');
      // remove this session from unpaid appointments since it's clearly been returned
      const trainerId = state.removeFundedAppointmentForClient(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentFundedByClient(event) {
      logger.info('handling unfundedAppointmentFundedByClient event in unpaidAppointmentsEventHandler');
      const trainerId = state.processNewlyFundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function trainerVerifiedAppointments(event) {
      logger.info('handling trainerVerifiedAppointments event in unpaidAppointmentsEventHandler');
      state.sessionsVerified(event.sessionIds);
      return await persistence.saveState(state, event.trainerId);
    }

    async function trainerPaid(event) {
      logger.info('handling trainerPaid event in unpaidAppointmentsEventHandler');
      state.trainerPaid(event.paidAppointments);
      return await persistence.saveState(state, event.trainerId);
    }

    async function sessionsRefunded(event) {
      logger.info('handling sessionsRefunded event in unpaidAppointmentsEventHandler');
      state.refundSessions(event);
      return await persistence.saveState(state);
    }

    async function pastAppointmentRemoved(event) {
      logger.info(`handling pastAppointmentRemoved event in unpaidAppointmentsEventHandler`);
      const trainerId = state.pastAppointmentRemoved(event.appointmentId);
      return await persistence.saveState(state, trainerId);
    }

    // we don't need to handle sessionReturnedFromPastAppointment because we don't do anything with
    // the sessions when used. We just need to clean up the unpaid and unfunded appointments
    // and the appointmentRemovedFromThePast will do that
    let output = {
      handlerType: 'unpaidAppointmentsEventHandler',
      handlerName: 'unpaidAppointmentsEventHandler',
      trainerVerifiedAppointments,
      unfundedAppointmentFundedByClient,
      unfundedAppointmentAttendedByClient,
      appointmentAttendedByClient,
      sessionsPurchased,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainersClientRatesUpdated,
      trainersNewClientRateSet,
      trainerPaid,
      sessionsRefunded,
      pastAppointmentRemoved,
      sessionReturnedFromPastAppointment
    };

    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
