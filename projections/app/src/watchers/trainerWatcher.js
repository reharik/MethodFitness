module.exports = function(metaLogger) {
  return function(state, persistence, handlerName) {

    async function trainerHired(event) {
      const trainer = {
        trainerId: event.trainerId,
        firstName: event.contact.firstName,
        lastName: event.contact.lastName,
        TCRS: []
      };
      state.innerState.trainers.push(trainer);

      await persistence.saveState(state);
    }

    async function trainerContactUpdated(event) {
      const subEvent = {
        trainerId: event.trainerId,
        firstName: event.contact.firstName,
        lastName: event.contact.lastName
      };

      state.innerState.trainers.map(x =>
        x.trainerId === subEvent.trainerId
          ? subEvent
          : x);
      await persistence.saveState(state);
    }

    return metaLogger({
      trainerHired,
      trainerContactUpdated
    }, handlerName);
  };
};
