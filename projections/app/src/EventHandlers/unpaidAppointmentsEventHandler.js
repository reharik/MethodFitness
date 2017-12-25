module.exports = function(unpaidAppointmentsPersistence,
                          appointmentWatcher,
                          trainerWatcher,
                          clientWatcher,
                          metaLogger,
                          statefulEventHandler,
                          logger) {

  return async function unpaidAppointmentsEventHandler() {

    const persistence = unpaidAppointmentsPersistence();
    let state = await persistence.initializeState();
    let stateMethods = statefulEventHandler(state.innerState, 'unpaidAppointmentsEventHandler');
    logger.info('unpaidAppointmentsEventHandler started up');

    async function fundedAppointmentAttendedByClient(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);
      const trainerId = state.fundedAppointmentAttendedByClient(event);

      return await persistence.saveState(newState, trainerId);
    }

    async function pastAppointmentRemoved(event) {
      const trainerId = state.pastAppointmentRemoved(event.appointmentId);
      let newState = stateMethods.trainersNewClientRateSet(event);
      return await persistence.saveState(newState, trainerId);
    }

    async function pastAppointmentUpdated(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function sessionsPurchased(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function sessionsRefunded(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function sessionReturnedFromPastAppointment(event) {
      // needs trainerId for save
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(event) {
      const trainerId = state.transferSession(event);
      return await persistence.saveState(state, trainerId);
    }

    async function trainerClientRemoved(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function trainersClientRateChanged(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function trainersClientRatesUpdated(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function trainersNewClientRateSet(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);

      return await persistence.saveState(newState);
    }

    async function trainerPaid(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);
      state.trainerVerifiedAppointments(event.paidAppointments);

      return await persistence.saveState(newState);
    }

    async function trainerVerifiedAppointments(event) {
      let newState = stateMethods.trainersNewClientRateSet(event);
      return await persistence.saveState(newState);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      const trainerId = state.unfundedAppointmentAttendedByClient(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentFundedByClient(event) {
      const trainerId = state.unfundedAppointmentFundedByClient(event);
      return await persistence.saveState(state, trainerId);
    }

    let output = metaLogger({
      handlerType: 'unpaidAppointmentsEventHandler',
      handlerName: 'unpaidAppointmentsEventHandler',
      fundedAppointmentAttendedByClient,
      pastAppointmentRemoved,
      pastAppointmentUpdated,
      sessionsPurchased,
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
      trainersClientRateChanged,
      trainersClientRatesUpdated,
      trainerClientRemoved,
      trainersNewClientRateSet,
      trainerPaid,
      trainerVerifiedAppointments,
      unfundedAppointmentFundedByClient,
      unfundedAppointmentAttendedByClient,
    }, 'unpaidAppointmentsEventHandler');

    // would like to get rid of this somehow
    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
