module.exports = function(
  unpaidAppointmentsPersistence,
  statefulEventHandler,
  metaLogger,
  logger,
) {
  return async function unpaidAppointmentsEventHandler() {
    const persistence = unpaidAppointmentsPersistence();
    let initialState = statefulEventHandler.getInitialState({
      unfundedAppointments: [],
      unpaidAppointments: [],
    });
    let state = await persistence.initializeState(initialState);

    const baseHandler = statefulEventHandler.baseHandler(
      state,
      persistence,
      'unpaidAppointmentsBaseHandler',
    );
    logger.info('unpaidAppointmentsEventHandler started up');

    async function fundedAppointmentAttendedByClient(event) {
      const trainerId = state.fundedAppointmentAttendedByClient(event);
      if (trainerId) {
        return await persistence.saveState(state, trainerId);
      }
      return Promise.rejected('appointment not found');
    }

    async function fundedAppointmentRemovedForClient(event) {
      const trainerId = state.fundedAppointmentRemovedForClient(event);
      return await persistence.saveState(state, trainerId);
    }

    async function pastAppointmentUpdated(event) {
      const trainerId = state.pastAppointmentUpdated(event);
      const result = await persistence.saveState(state, trainerId);
      if (event.oldTrainerId) {
        await persistence.saveTrainer(state, event.oldTrainerId);
      }
      return result;
    }

    async function sessionReturnedFromPastAppointment(event) {
      const trainerId = state.sessionReturnedFromPastAppointment(event);
      await persistence.saveState(state, trainerId);
    }
    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(
      event,
    ) {
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
      if (trainerId) {
        return await persistence.saveState(state, trainerId);
      }
      return Promise.rejected('appointment not found');
    }

    async function unfundedAppointmentFundedByClient(event) {
      const trainerId = state.unfundedAppointmentFundedByClient(event);
      return await persistence.saveState(state, trainerId);
    }

    async function unfundedAppointmentRemovedForClient(event) {
      const trainerId = state.unfundedAppointmentRemovedForClient(event);
      return await persistence.saveState(state, trainerId);
    }

    return metaLogger(
      {
        handlerType: 'unpaidAppointmentsEventHandler',
        handlerName: 'unpaidAppointmentsEventHandler',
        baseHandlerName: 'unpaidAppointmentsBaseStateEventHandler',
        baseHandler,
        fundedAppointmentAttendedByClient,
        fundedAppointmentRemovedForClient,
        pastAppointmentUpdated,
        sessionReturnedFromPastAppointment,
        sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
        trainerPaid,
        unfundedAppointmentFundedByClient,
        unfundedAppointmentAttendedByClient,
        unfundedAppointmentRemovedForClient,
      },
      'unpaidAppointmentsEventHandler',
    );
  };
};
