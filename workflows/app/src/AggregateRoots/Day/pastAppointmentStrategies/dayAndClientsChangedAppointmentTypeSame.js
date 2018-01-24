module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.originalEntityName !== cmd.entityName
        && cmd.changes.clients
        && !cmd.changes.appointmentType,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async(cmd, origAppointment) => {
      logger.debug('dayAndClientsChangedAppointmentTypeSame strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      let result = [];
      // if a client is no longer on the appointment refund the session
      for (let clientId of origAppointment.clients.filter(x => !cmd.clients.find(y => y === x))) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('returning session to client');
        c.returnSessionFromPast(cmd.appointmentId);
        c.removePastAppointmentForClient(cmd.appointmentId);
        result.push({type: 'client', instance: c});
      }
      // if a new client is on appointment associate a session with them
      for (let clientId of cmd.clients.filter(x => !origAppointment.clients.find(y => y === x))) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('associating new client with updated appointment from past');
        c.clientAttendsAppointment(cmd);
        result.push({type: 'client', instance: c});
      }

      dayInstance.updateAppointmentFromPast(cmd, true);
      result.push({type: 'day', instance: dayInstance});

      return result;
    }
  };
};
