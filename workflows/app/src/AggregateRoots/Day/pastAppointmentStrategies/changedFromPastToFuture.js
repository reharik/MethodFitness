module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.isPastToFuture,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async(cmd, origAppointment) => {
      logger.debug('changeFromPastTOFuture strategy chosen');
      let result = [];
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();

      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('returning session to client');
        c.returnSessionFromPast(cmd.appointmentId);
        c.removePastAppointmentForClient(cmd.appointmentId);
        result.push({type: 'client', instance: c});
      }

      dayInstance.updateAppointmentFromPast(cmd, true);
      // dayInstance.scheduleAppointment(cmd);
      result.push({type: 'day', instance: dayInstance});

      return result;
    }
  };
};
