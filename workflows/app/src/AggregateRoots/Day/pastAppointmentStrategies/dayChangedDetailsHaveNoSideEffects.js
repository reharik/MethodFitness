module.exports = function(eventRepository, day, logger) {
  return {
    evaluate: cmd => !cmd.isPastToFuture
        && cmd.originalEntityName !== cmd.entityName
        && !cmd.changes.clients
        && !cmd.changes.appointmentType,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async cmd => {
      logger.debug('dayChangedDetailsHaveNoSideEffects strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.rescheduleAppointmentInPast(cmd);
      return [{type: 'day', instance: dayInstance}];
    }
  };
};
