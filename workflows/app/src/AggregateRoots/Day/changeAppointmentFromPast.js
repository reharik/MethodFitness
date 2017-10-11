module.exports = function(eventRepository, pastAppointmentStrategies_array, day, sortby, logger) {
  return async function changeAppointmentFromPast(cmd, continuationId) {

    // if orig is not set set it to entityName so equalities will work
    cmd.originalEntityName = cmd.originalEntityName || cmd.entityName;

    let origAppointment;
    if (cmd.originalEntityName !== cmd.entityName) {
      let oldDay = await eventRepository.getById(day, cmd.originalEntityName);
      origAppointment = Object.assign({}, oldDay.getAppointment(cmd.appointmentId));
      oldDay.removeAppointmentFromPast(cmd);
    }

    let result = [];
    for (let strategy of pastAppointmentStrategies_array) {
      if (strategy.evaluate(cmd)) {
        result = await strategy.execute(cmd, origAppointment);
        break;
      }
    }
    for (let r of result.sort(sortby('-type'))) {
      logger.info(`saving ${r.type}`);
      logger.trace(r.instance.state._id);
      await eventRepository.save(r.instance, { continuationId });
    }
  };
};