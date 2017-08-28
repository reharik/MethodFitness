module.exports = function(logger) {
  return function(state, persistence, handlerName) {

    async function trainerHired(event) {
      logger.info(`handling trainerHired event in ${handlerName}`);
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
      logger.info(`handling trainerContactUpdated event in ${handlerName}`);
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

    return {
      trainerHired,
      trainerContactUpdated
    };
  };
};
