module.exports = function(eventRepository, logger, Client) {
  return function ClientWorkflow() {
    async function addClient(cmd, continuationId) {
      logger.info('calling addClient');
      let client = new Client();
      client.addClient(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function updateClientAddress(cmd, continuationId) {
      logger.info('calling updateClientAddress');
      let client = await eventRepository.getById(Client, cmd.id);
      client.updateClientAddress(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function updateClientContact(cmd, continuationId) {
      logger.info('calling updateClientContact');
      let client = await eventRepository.getById(Client, cmd.id);
      client.updateClientContact(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function updateClientInfo(cmd, continuationId) {
      logger.info('calling updateClientInfo');
      let client = await eventRepository.getById(Client, cmd.id);
      client.updateClientInfo(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function updateClientSource(cmd, continuationId) {
      logger.info('calling updateClientSource');
      let client = await eventRepository.getById(Client, cmd.id);
      client.updateClientSource(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function clientAttendsAppointment(cmd, continuationId) {
      logger.info('clientAttendsAppointment');
      let client = await eventRepository.getById(Client, cmd.id);
      client.clientAttendsAppointment(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function archiveClient(cmd, continuationId) {
      logger.info('calling archiveClient');
      let client = await eventRepository.getById(Client, cmd.id);
      client.archiveClient(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
    }

    async function unArchiveClient(cmd, continuationId) {
      logger.info('calling unArchiveClient');
      let client = await eventRepository.getById(Client, cmd.id);
      client.unArchiveClient(cmd);

      logger.info('saving client');
      logger.trace(client);

      await eventRepository.save(client, { continuationId });
      return { clientId: client._id };
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
      clientAttendsAppointment
    };
  };
};
