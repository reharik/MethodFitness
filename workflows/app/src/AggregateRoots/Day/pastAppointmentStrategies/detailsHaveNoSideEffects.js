module.exports = function(eventRepository, day, logger) {
  return {
    evaluate: cmd => !cmd.isPastToFuture
      && cmd.originalEntityName === cmd.entityName
      && !cmd.changes.clients
      && !cmd.changes.appointmentType,

    execute: async cmd => {
      logger.debug('detailsHaveNoSideEffects strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      dayInstance.updateAppointmentFromPast(cmd, false, true);
      return [{type: 'day', instance: dayInstance}];
    }
  };
};
