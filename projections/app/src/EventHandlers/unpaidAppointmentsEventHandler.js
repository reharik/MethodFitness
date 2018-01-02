module.exports = function(unpaidAppointmentsPersistence,
                          statefulEventHandler,
                          metaLogger,
                          logger) {

  return async function unpaidAppointmentsEventHandler() {

    const persistence = unpaidAppointmentsPersistence();
    let state = await persistence.initializeState();
    const baseHandler = statefulEventHandler(state.innerState, persistence, 'unpaidAppointmentsEventHandler');
    logger.info('unpaidAppointmentsEventHandler started up');

    async function fundedAppointmentAttendedByClient(event) {
      const trainerId = state.fundedAppointmentAttendedByClient(event);

      return await persistence.saveState(state, trainerId);
    }

    async function pastAppointmentRemoved(event) {
      const trainerId = state.pastAppointmentRemoved(event.appointmentId);
      return await persistence.saveState(state, trainerId);
    }


    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(event) {
      const trainerId = state.transferSession(event);
      return await persistence.saveState(state, trainerId);
    }

    async function trainerPaid(event) {
      state.trainerPaid(event);

      return await persistence.saveState(state, event.trainerId);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      const trainerId = state.unfundedAppointmentAttendedByClient(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentFundedByClient(event) {
      const trainerId = state.unfundedAppointmentFundedByClient(event);
      return await persistence.saveState(state, trainerId);
    }

    return metaLogger({
      handlerType: 'unpaidAppointmentsEventHandler',
      handlerName: 'unpaidAppointmentsEventHandler',
      baseHandlerName: 'unpaidAppointmentsBaseStateEventHandler',
      baseHandler,
      fundedAppointmentAttendedByClient,
      pastAppointmentRemoved,
      sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
      trainerPaid,
      unfundedAppointmentFundedByClient,
      unfundedAppointmentAttendedByClient
    }, 'unpaidAppointmentsEventHandler');
  };
};
