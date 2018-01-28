module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => !cmd.isPastToFuture
        && cmd.originalEntityName !== cmd.entityName
        && !cmd.changes.clients
        && !cmd.changes.appointmentType,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async(cmd, origAppointment) => {
      logger.debug('dayChangedDetailsHaveNoSideEffects strategy chosen');
      let result = [];
      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        c.updateAppointmentFromPast(cmd);
        result.push({type: 'client', instance: c});
      }
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      dayInstance.updateAppointmentFromPast(cmd, true, true);
      result.push({type: 'day', instance: dayInstance});
      return result;
    }
  };
};
