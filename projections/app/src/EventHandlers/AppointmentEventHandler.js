module.exports = function(
  appointmentsPersistence,
  statefulEventHandler,
  metaLogger,
  logger,
) {
  return async function appointmentsEventHandler() {
    const persistence = appointmentsPersistence();
    let initialState = statefulEventHandler.getInitialState(
      { locations: [] },
      { appointments: true, sessions: true },
    );
    let state = await persistence.initializeState(initialState);

    const baseHandler = statefulEventHandler.baseHandler(
      state,
      persistence,
      'appointmentsBaseHandler',
    );
    logger.info('AppointmentEventHandler started up');

    async function appointmentScheduledInPast(event) {
      return await appointmentScheduled(event);
    }

    async function appointmentScheduled(event) {
      const appointment = state.appointmentScheduled(event);
      return await persistence.saveState(state, appointment);
    }

    async function appointmentCanceled(event) {
      return await persistence.deleteAppointment(event.appointmentId);
    }

    async function pastAppointmentRemoved(event) {
      if (event.rescheduled) {
        return null;
      }
      return await persistence.deleteAppointment(event.appointmentId);
    }

    async function pastAppointmentUpdated(event) {
      return await appointmentUpdated(event);
    }

    async function appointmentUpdated(event) {
      const appointment = await state.appointmentUpdated(event);
      return await persistence.saveState(state, appointment);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await fundedAppointmentAttendedByClient(event);
    }

    async function fundedAppointmentAttendedByClient(event) {
      const appointment = await state.appointmentCompleted(event);
      return await persistence.saveAppointmentOnly(appointment);
    }
    //
    // async function trainerPaid(event) {
    //   const appointments = state.trainerPaid(event);
    //
    //   // this looks bad because it doesn't wait for any of the responses,
    //   // but I don't need em so it's actually better.  Unless it throws, which could be bad
    //   appointments.forEach(async appointment => {
    //     await persistence.saveAppointmentOnly(appointment);
    //   });
    // }

    // I'm not doing client info change because the occurance of client name change
    // is pretty rare and the effect very limited plus it's much more difficult
    async function trainerInfoUpdated(event) {
      const appointments = state.trainerInfoUpdated(event);
      appointments.forEach(async appointment => {
        await persistence.saveAppointmentOnly(appointment);
      });
    }

    async function locationUpdated(event) {
      const appointments = state.locationUpdated(event);
      // save the new location state to the metadata
      await persistence.saveState(state);
      appointments.forEach(async appointment => {
        await persistence.saveAppointmentOnly(appointment);
      });
    }

    async function locationAdded(event) {
      state.locationAdded(event);
      // save the new location state to the metadata
      await persistence.saveState(state);
    }

    return metaLogger(
      {
        handlerName: 'AppointmentEventHandler',
        baseHandlerName: 'AppointmentBaseStateEventHandler',
        baseHandler,
        appointmentScheduled,
        appointmentUpdated,
        appointmentCanceled,
        fundedAppointmentAttendedByClient,
        unfundedAppointmentAttendedByClient,
        appointmentScheduledInPast,
        pastAppointmentRemoved,
        pastAppointmentUpdated,
        // trainerPaid,
        trainerInfoUpdated,
        locationUpdated,
        locationAdded,
      },
      'AppointmentEventHandler',
    );
  };
};
