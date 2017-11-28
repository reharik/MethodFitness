module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.isPastToFuture,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async (cmd, origAppointment) => {
      logger.debug('changeFromPastTOFuture strategy chosen');

      let result = [];
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.scheduleAppointment(cmd);
      result.push({type: 'day', instance: dayInstance});

      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('refunding client for appointment in past');
        c.returnSessionFromPast(cmd.appointmentId);
        logger.info('saving client');
        result.push({type: 'client', instance: c});
      }

      return result;
    }
  };
};
