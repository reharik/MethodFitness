module.exports = function(
  eventRepository,
  metaLogger,
  logger,
  client,
  trainer,
  day,
) {
  return function ClientWorkflow() {
    async function handleCommand(cmd, continuationId, funcName) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      clientInstance[funcName](cmd);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function addClient(cmd, continuationId) {
      let clientInstance = client();
      clientInstance.addClient(cmd);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function updateClientAddress(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'updateClientAddress');
    }

    async function updateClientContact(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'updateClientContact');
    }

    async function updateClientInfo(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'updateClientInfo');
    }

    async function updateClientSource(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'updateClientSource');
    }

    async function clientAttendsAppointment(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      await clientInstance.clientAttendsAppointment(cmd, trainer, day);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function archiveClient(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'archiveClient');
    }

    async function unArchiveClient(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'unArchiveClient');
    }

    async function purchase(cmd, continuationId) {
      let clientInstance = await eventRepository.getById(client, cmd.clientId);
      await clientInstance.purchase(cmd, trainer);

      logger.info('saving clientInstance');
      logger.trace(JSON.stringify(clientInstance));

      await eventRepository.save(clientInstance, { continuationId });
      return { clientId: clientInstance.state._id };
    }

    async function refundSessions(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'refundSessions');
    }

    return metaLogger(
      {
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
      },
      'ClientWorkflow',
    );
  };
};
