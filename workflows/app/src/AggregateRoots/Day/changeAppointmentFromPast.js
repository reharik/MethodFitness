// eslint-disable-next-line camelcase
module.exports = function(
  eventRepository,
  pastAppointmentStrategies_array,
  day,
  client,
  sortby,
  logger,
) {
  return async function changeAppointmentFromPast(cmd, continuationId) {
    // if orig is not set set it to entityName so equalities will work
    cmd.originalEntityName = cmd.originalEntityName || cmd.entityName;

    let origAppointment;
    const dayInstance = await eventRepository.getById(day, cmd.entityName);

    if (cmd.originalEntityName !== cmd.entityName || cmd.isPastToFuture) {
      let oldDay = await eventRepository.getById(day, cmd.originalEntityName);
      origAppointment = Object.assign(
        {},
        oldDay.getAppointment(cmd.appointmentId),
      );
      oldDay.removeAppointmentFromPast(cmd, true);

      await eventRepository.save(oldDay, { continuationId });
    } else {
      origAppointment = dayInstance.getAppointment(cmd.appointmentId);
    }

    let result = [];
    for (let strategy of pastAppointmentStrategies_array) {
      // eslint-disable-line camelcase
      if (strategy.evaluate(cmd)) {
        result = await strategy.execute(cmd, dayInstance, origAppointment);
        break;
      }
    }

    await eventRepository.save(dayInstance, { continuationId });

    for (const c of result) {
      logger.info(`saving client`);
      logger.trace(c.state._id);
      await eventRepository.save(c, { continuationId });
    }
  };
};
