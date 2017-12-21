module.exports = function(unpaidAppointmentsPersistence,
                          appointmentWatcher,
                          trainerWatcher,
                          clientWatcher,
                          metaLogger,
                          logger) {

  return async function unpaidAppointmentsEventHandler() {

    const persistence = unpaidAppointmentsPersistence();
    let state = await persistence.initializeState();
    logger.info('unpaidAppointmentsEventHandler started up');

    async function trainersNewClientRateSet(event) {
      state.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await persistence.saveState(state);
    }

    async function trainersClientRateChanged(event) {
      state.updateTCR(event);

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

    async function trainerClientRemoved(event) {
      state.removeTCR(event);

      return await persistence.saveState(state);
    }

    async function sessionsPurchased(event) {
      event.sessions.forEach(e => state.addSession(e));
      return await persistence.saveState(state);
    }

    async function appointmentAttendedByClient(event) {
      const trainerId = state.processAttendedFundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      const trainerId = state.processAttendedUnfundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function sessionReturnedFromPastAppointment(event) {
      // remove this session from unpaid appointments since it's clearly been returned
      const trainerId = state.removeFundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentFundedByClient(event) {
      const trainerId = state.processNewlyFundedAppointment(event);
      return await persistence.saveState(state, trainerId);
    }

    async function trainerVerifiedAppointments(event) {
      state.sessionsVerified(event.sessionIds);
      return await persistence.saveState(state, event.trainerId);
    }

    async function trainerPaid(event) {
      state.trainerPaid(event.paidAppointments);
      return await persistence.saveState(state, event.trainerId);
    }

    async function sessionsRefunded(event) {
      state.refundSessions(event);
      return await persistence.saveState(state);
    }

    async function pastAppointmentRemoved(event) {
      const trainerId = state.pastAppointmentRemoved(event.appointmentId);
      return await persistence.saveState(state, trainerId);
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(event) {
      const trainerId = state.transferSession(event);
      return await persistence.saveState(state, trainerId);
    }

    // we don't need to handle sessionReturnedFromPastAppointment because we don't do anything with
    // the sessions when used. We just need to clean up the unpaid and unfunded appointments
    // and the appointmentRemovedFromThePast will do that
    let output = metaLogger({
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
      sessionReturnedFromPastAppointment,
      sessionTransferredFromRemovedAppointmentToUnfundedAppointment
    }, 'unpaidAppointmentsEventHandler');

    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
