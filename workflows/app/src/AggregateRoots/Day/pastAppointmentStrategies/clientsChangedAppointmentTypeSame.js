module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.originalEntityName === cmd.entityName
        && cmd.changes.clients
        && !cmd.changes.appointmentType,

    execute: async cmd => {
      logger.debug('clientsChangedAppointmentTypeSame strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      const origAppointment = dayInstance.getAppointment(cmd.appointmentId);
      let result = [];

      // if a client is no longer on the appointment refund the session
      // if they are still on then update them
      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        if (!cmd.clients.any(y => y === clientId)) {
          logger.debug('returning session to client');
          c.returnSessionFromPast(cmd.appointmentId);
          c.removePastAppointmentForClient(cmd.appointmentId);
        } else {
          c.updateAppointmentFromPast(cmd);
        }
        result.push({type: 'client', instance: c});
      }

      // if a new client is on appointment associate a session with them
      for (let clientId of cmd.clients.filter(x => !origAppointment.clients.find(y => y === x))) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('associating new client with updated appointment from past');
        c.clientAttendsAppointment(cmd);
        result.push({type: 'client', instance: c});
      }

      dayInstance.updateAppointmentFromPast(cmd);
      result.push({type: 'day', instance: dayInstance});

      return result;
    }
  };
};
