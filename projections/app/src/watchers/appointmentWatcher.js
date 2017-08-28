module.exports = function(logger) {
  return function(state, persistence, handlerName) {

    async function appointmentScheduled(event) {
      // const {eventName, endTime, notes, entityName, ...subEvent} = event; //eslint-disable-line no-unused-vars
      logger.info(`handling appointmentScheduled event in ${handlerName}`);
      const subEvent = Object.assign({}, event);
      delete subEvent.eventName;
      delete subEvent.endTime;
      delete subEvent.notes;
      delete subEvent.entityName;
      state.innerState.appointments.push(subEvent);
      await persistence.saveState(state);
    }

    async function appointmentUpdated(event) {
      // const {eventName, endTime, notes, entityName, ...subEvent} = event; //eslint-disable-line no-unused-vars

      logger.info(`handling appointmentUpdated event in ${handlerName}`);
      const subEvent = Object.assign({}, event);
      delete subEvent.eventName;
      delete subEvent.endTime;
      delete subEvent.notes;
      delete subEvent.entityName;
      state.innerState.appointments = state.innerState.appointments.map(x =>
        x.appointmentId === subEvent.appointmentId
          ? subEvent
          : x);
      await persistence.saveState(state);
    }

    async function appointmentCanceled(event) {
      logger.info(`handling appointmentCanceled event in ${handlerName}`);
      state.innerState.appointments = state.innerState.appointments
        .filter(x => x.appointmentId !== event.appointmentId);
      await persistence.saveState(state);
    }

    return {
      appointmentScheduled,
      appointmentUpdated,
      appointmentCanceled
    };
  };
};
