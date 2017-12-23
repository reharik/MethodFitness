module.exports = function(metaLogger) {
  return function(state, persistence, handlerName) {

    async function appointmentScheduled(event) {
      // const {eventName, endTime, notes, entityName, ...subEvent} = event; //eslint-disable-line no-unused-vars
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
      state.innerState.appointments = state.innerState.appointments
        .filter(x => x.appointmentId !== event.appointmentId);
      await persistence.saveState(state);
    }

    async function appointmentScheduledInPast(event) {
      // const {eventName, endTime, notes, entityName, ...subEvent} = event; //eslint-disable-line no-unused-vars
      const subEvent = Object.assign({}, event);
      delete subEvent.eventName;
      delete subEvent.endTime;
      delete subEvent.notes;
      delete subEvent.entityName;
      state.innerState.appointments.push(subEvent);
      await persistence.saveState(state);
    }

    async function pastAppointmentUpdated(event) {
      // const {eventName, endTime, notes, entityName, ...subEvent} = event; //eslint-disable-line no-unused-vars
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

    async function pastAppointmentRemoved(event) {
      state.innerState.appointments = state.innerState.appointments
        .filter(x => x.appointmentId !== event.appointmentId);
      await persistence.saveState(state);
    }

    return metaLogger({
      appointmentScheduled,
      appointmentUpdated,
      appointmentCanceled,
      appointmentScheduledInPast,
      pastAppointmentUpdated,
      pastAppointmentRemoved
    }, handlerName);
  };
};
