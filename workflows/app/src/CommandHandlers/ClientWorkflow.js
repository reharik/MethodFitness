module.exports = function(eventRepository, logger, client) {
  return function ClientWorkflow() {
    async function addClient(cmd, continuationId) {
      logger.info('calling addClient');
      let clientInstance = client();
      clientInstance.addClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientAddress(cmd, continuationId) {
      logger.info('calling updateClientAddress');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientAddress(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientContact(cmd, continuationId) {
      logger.info('calling updateClientContact');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientContact(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientInfo(cmd, continuationId) {
      logger.info('calling updateClientInfo');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientInfo(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientSource(cmd, continuationId) {
      logger.info('calling updateClientSource');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.updateClientSource(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function clientAttendsAppointment(cmd, continuationId) {
      logger.info('clientAttendsAppointment');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.clientAttendsAppointment(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function archiveClient(cmd, continuationId) {
      logger.info('calling archiveClient');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.archiveClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function unArchiveClient(cmd, continuationId) {
      logger.info('calling unArchiveClient');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.unArchiveClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(clientInstance);

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function purchase(cmd, continuationId) {
      logger.info('calling purchase');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.purchase(cmd);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));
      await eventRepository.save(clientInstance, { continuationId });

      return { clientId: clientInstance.state._id };
    }

    async function refundSessions(cmd, continuationId) {
      logger.info('calling refundSessions');
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance.refundSessions(cmd);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));

      await eventRepository.save(clientInstance, { continuationId });

      return { clientId: clientInstance.state._id };
    }

    async function removeAppointmentFromPast(cmd, continuationId) {
      logger.info(`calling ${cmd.commandName} on Client`);
      for (let c of cmd.clients) {
        let clientInstance = await eventRepository.getById(client, c);
        clientInstance.returnSessionFromPast(cmd.appointmentId);

        logger.info('saving clientInstance');
        logger.trace(clientInstance._id);

        await eventRepository.save(clientInstance, {continuationId});
      }
      return { appointmentId: cmd.appointmentId };
    }


    return {
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
    };
  };
};
