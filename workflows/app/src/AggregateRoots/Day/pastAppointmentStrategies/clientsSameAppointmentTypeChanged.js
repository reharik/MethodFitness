module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.originalEntityName === cmd.entityName
       && !cmd.changes.clients
       && cmd.changes.appointmentType,

    execute: async cmd => {
      logger.debug('clientsSameAppointmentTypeChanged strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      const origAppointment = dayInstance.getAppointment(cmd.appointmentId);

      let result = [];
      // refund session for all client on appointment
      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('returning session to client');
        c.returnSessionFromPast(cmd.appointmentId, cmd.appointmentType);
        result.push({type: 'client', instance: c});
      }
      // update appointment so now we have correct appointmentType
      dayInstance.updateAppointmentFromPast(cmd);

      // charge all clients for new appointment type
      result.map(x => x.instance).forEach(clientInstance => {
        logger.debug('associating client with updated appointment from past');
        clientInstance.clientAttendsAppointment(cmd);
      });

      result.push({type: 'day', instance: dayInstance});
      return result;
    }
  };
};
