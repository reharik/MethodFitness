module.exports = function(eventRepository, day, logger) {
  return {
    evaluate: cmd => cmd.originalEntityName !== cmd.entityName
        && !cmd.changes.clients
        && !cmd.changes.appointmentType,

    execute: async cmd => {
      logger.debug('dayChangedDetailsHaveNoSideEffects strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.updateAppointmentFromPast(cmd);
      return [{type: 'day', instance: dayInstance}];
    }
  };
};
