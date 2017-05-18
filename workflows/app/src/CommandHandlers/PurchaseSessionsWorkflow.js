module.exports = function(eventRepository,
                          logger,
                          Client) {

  return function PurchasesWorkflow(){

    async function purchase(cmd, continuationId) {
      logger.info('calling purchase');
      var client = await eventRepository.getById(Client, cmd.clientId);
      client.purchase(cmd);

      logger.info('saving client');
      logger.trace(JSON.stringify(client));

      await eventRepository.save(client, { continuationId });

      return {clientId: client._id}
    }

    return {
      handlerName: 'PurchasesWorkflow',
      purchase
    }
  };
};
