module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd =>
      !cmd.isPastToFuture &&
      !cmd.isFutureToPast &&
      (cmd.changes.clients || cmd.changes.appointmentType),

    execute: async (cmd, dayInstance, origAppointment) => {
      logger.debug('appointmentUpdatedWITHSideEffects strategy chosen');
      let result = [];

      // refund session for all client on appointment
      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);

        logger.debug(
          `removing session from past for appointmentId: ${
            cmd.appointmentId
          } for clientId: ${clientId}`,
        );
        c.returnSessionFromPast(cmd.appointmentId);
        c.removePastAppointmentForClient(cmd.appointmentId);
        result.push(c);
      }

      // update appointment so now we have correct clients and correct appointmentType
      dayInstance.updateAppointmentFromPast(cmd);

      // charge all final clients for new appointment type
      for (let clientId of cmd.clients) {
        let cFromRepo;
        let c = result.filter(x => x.state._id === clientId)[0];
        if (!c) {
          cFromRepo = true;
          c = await eventRepository.getById(client, clientId);
        }
        logger.debug(
          `adding session to past for appointmentId: ${
            cmd.appointmentId
          } for clientId: ${clientId}`,
        );
        c.clientAttendsAppointment(cmd);
        if (cFromRepo) {
          result.push(c);
        }
      }

      return result;
    },
  };
};
