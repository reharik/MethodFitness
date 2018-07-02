module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd =>
      !cmd.isPastToFuture &&
      !cmd.isFutureToPast &&
      !cmd.changes.clients &&
      !cmd.changes.appointmentType,

    execute: async (cmd, dayInstance, origAppointment) => {
      logger.debug('appointmentUpdatedNOSideEffects strategy chosen');
      let result = [];
      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug(
          `updating appointment id: ${
            cmd.appointmentId
          } for client Id: ${clientId}`,
        );
        c.updateAppointmentFromPast(cmd);
        result.push(c);
      }

      dayInstance.updateAppointmentFromPast(cmd, true, true);
      return result;
    },
  };
};
