module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => !cmd.isPastToFuture
      && cmd.originalEntityName === cmd.entityName
      && !cmd.changes.clients
      && !cmd.changes.appointmentType,

    execute: async cmd => {
      logger.debug('detailsHaveNoSideEffects strategy chosen');
      let result = [];
      let dayInstance = await eventRepository.getById(day, cmd.entityName);
      const origAppointment = dayInstance.getAppointment(cmd.appointmentId);

      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        c.updateAppointmentFromPast(cmd);
        result.push({type: 'client', instance: c});
      }

      dayInstance.updateAppointmentFromPast(cmd, false, true);
      result.push({type: 'day', instance: dayInstance});
      return result;
    }
  };
};
