module.exports = function(unpaidAppointmentsPersistence,
                          statefulEventHandler,
                          metaLogger,
                          logger) {

  return async function unpaidAppointmentsEventHandler() {

    const persistence = unpaidAppointmentsPersistence();
    let initialState = statefulEventHandler.getInitialState({
      unfundedAppointments: [],
      unpaidAppointments: []
    });
    let state = await persistence.initializeState(initialState);

    const baseHandler = statefulEventHandler.baseHandler(state, persistence, 'unpaidAppointmentsBaseHandler');
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
      if (trainerId) {
        return await persistence.saveState(state, trainerId);
      }
      return undefined;
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
