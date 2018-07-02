module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.isPastToFuture || cmd.isFutureToPast,

    execute: async (cmd, dayInstance, origAppointment) => {
      logger.debug('movingBetweenPastAndFuture strategy chosen');
      let result = [];

      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);

        if (cmd.isPastToFuture) {
          logger.debug(
            `removing session from past for appointmentId: ${
              cmd.appointmentId
            } for clientId: ${clientId}`,
          );
          c.returnSessionFromPast(cmd.appointmentId);
          c.removePastAppointmentForClient(cmd.appointmentId);
        } else if (cmd.isFutureToPast) {
          logger.debug(
            `adding session to past for appointmentId: ${
              cmd.appointmentId
            } for clientId: ${clientId}`,
          );
          c.clientAttendsAppointment(cmd);
        }

        result.push(c);
      }

      dayInstance.updateAppointmentFromPast(cmd, true);
      return result;
    },
  };
};
