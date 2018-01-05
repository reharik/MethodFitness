module.exports = function(eventRepository, day, client, logger) {
  return {
    evaluate: cmd => cmd.originalEntityName !== cmd.entityName
      && cmd.changes.clients
      && cmd.changes.appointmentType,

    // caller (changeAppointmentFromPast) removes the appointment, we handle the new day fixing any sessions
    execute: async(cmd, origAppointment) => {
      logger.debug('dayClientsAndAppointmentTypeChanged strategy chosen');
      let dayInstance = await eventRepository.getById(day, cmd.entityName) || day();
      let result = [];

      // refund session for all client on appointment
      for (let clientId of origAppointment.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('returning session to client');
        c.returnSessionFromPast(cmd.appointmentId);
        c.removePastAppointmentForClient(cmd.appointmentId);
        result.push({type: 'client', instance: c});
      }

      // update appointment so now we have correct clients and correct appointmentType
      dayInstance.rescheduleAppointmentInPast(cmd);

      // charge all final clients for new appointment type
      for (let clientId of cmd.clients) {
        let cFromRepo;
        //TODO check if this x.instance has an _id or if it's like state._id
        let c = result.find(x => x.type === 'client' && x.instance._id === clientId);
        if (!c) {
          cFromRepo = true;
          c = await eventRepository.getById(client, clientId);
        }
        logger.debug('associating client with updated appointment from past');
        c.clientAttendsAppointment(cmd);
        if (cFromRepo) {
          result.push({type: 'client', instance: c});
        }
      }

      result.push({type: 'day', instance: dayInstance});
      return result;
    }
  };
};
