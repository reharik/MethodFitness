module.exports = function(eventRepository, metaLogger, logger, client) {
  return function ClientWorkflow() {
    async function addClient(cmd, continuationId) {
      let clientInstance = client();
      clientInstance.addClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientAddress(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientAddress(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientContact(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientContact(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientInfo(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientInfo(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientSource(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientSource(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function clientAttendsAppointment(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.clientAttendsAppointment(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function archiveClient(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.archiveClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function unArchiveClient(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.unArchiveClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function purchase(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.purchase(cmd);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));
      await eventRepository.save(clientInstance, { continuationId });

      return { clientId: clientInstance.state._id };
    }

    async function refundSessions(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.refundSessions(cmd);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));

      await eventRepository.save(clientInstance, { continuationId });

      return { clientId: clientInstance.state._id };
    }

    async function removeAppointmentFromPast(cmd, continuationId) {
      for (let clientId of cmd.clients) {
        let c = await eventRepository.getById(client, clientId);
        logger.debug('refunding client for appointment in past');
        c.returnSessionFromPast(cmd.appointmentId);
        c.removePastAppointmentForClient(cmd.appointmentId);
        logger.info('saving client');
        await eventRepository.save(c, { continuationId });
      }
    }

    return metaLogger({
      handlerName: 'ClientWorkflow',
      addClient,
      updateClientInfo,
      updateClientAddress,
      updateClientContact,
      updateClientSource,
      archiveClient,
      unArchiveClient,
      clientAttendsAppointment,
      purchase,
      refundSessions,
      removeAppointmentFromPast
    }, 'ClientWorkflow');
  };
};
