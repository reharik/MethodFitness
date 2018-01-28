module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.isFutureToPast,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async cmd => {
      logger.debug('changeFromPastTOFuture strategy chosen');

      let result = [];
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();

      for (let clientId of cmd.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('associating new client with updated appointment from past');
        c.clientAttendsAppointment(cmd);
        result.push({type: 'client', instance: c});
      }

      dayInstance.updateAppointmentFromPast(cmd, true);
      // dayInstance.scheduleAppointment(cmd);
      result.push({type: 'day', instance: dayInstance});

      return result;
    }
  };
};
