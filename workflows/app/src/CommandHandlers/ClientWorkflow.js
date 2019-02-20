module.exports = function(eventRepository, metaLogger, logger, client) {
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
      return handleCommand(cmd, continuationId, 'clientAttendsAppointment');
    }

    async function archiveClient(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'archiveClient');
    }

    async function unArchiveClient(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'unArchiveClient');
    }

    async function purchase(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'purchase');
    }

    async function refundSessions(cmd, continuationId) {
      return handleCommand(cmd, continuationId, 'refundSessions');
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
        removeAppointmentFromPast,
      },
      'ClientWorkflow',
    );
  };
};
