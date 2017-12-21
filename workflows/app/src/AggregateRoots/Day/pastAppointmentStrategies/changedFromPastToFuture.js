module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.isPastToFuture,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async cmd => {
      logger.debug('changeFromPastTOFuture strategy chosen');

      let result = [];
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.scheduleAppointment(cmd);
      result.push({type: 'day', instance: dayInstance});

      return result;
    }
  };
};
