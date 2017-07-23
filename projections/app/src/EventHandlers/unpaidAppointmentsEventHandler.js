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

    async function appointmentAttendedByUnfundedClient(event) {
      logger.info('handling appointmentAttendedByUnfundedClient event in unpaidAppointmentsEventHandler');
      const trainerId = state.processUnfundedAppointment(event);
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

    let output = {
      handlerType: 'unpaidAppointmentsEventHandler',
      handlerName: 'unpaidAppointmentsEventHandler',
      trainerVerifiedAppointments,
      unfundedAppointmentFundedByClient,
      appointmentAttendedByUnfundedClient,
      appointmentAttendedByClient,
      sessionsPurchased,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainersNewClientRateSet,
      trainerPaid,
      sessionsRefunded
    };

    return Object.assign(output,
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName));
  };
};