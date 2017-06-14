module.exports = function(config,
                          Promise,
                          uuid,
                          eventstore,
                          loadClients,
                          loadTrainers,
                          loadPurchases,
                          loadAppointments) {
  return function () {

    const processCommands = async function (command, commandName) {
      await eventstore.commandPoster(
        command,
        commandName,
        uuid.v4());
    };

    const populateES = async function () {
      for (let x of loadClients.clients) {
        let command = loadClients.addClient(x);
        await processCommands(command, 'addClient');
      }

      for (let x of loadTrainers.trainers) {
        let command = loadTrainers.addTrainer(x);
        await processCommands(command, 'hireTrainer');
      }

      const addClientsToTrainer1 = {
        id: loadTrainers.trainers[0].id,
        clients: [
          loadClients.clients[0].id,
          loadClients.clients[1].id,
          loadClients.clients[2].id]
      };

      await processCommands(addClientsToTrainer1, 'updateTrainersClients');

      const addClientsToTrainer2 = {
        id: loadTrainers.trainers[2].id,
        clients: [
          loadClients.clients[0].id,
          loadClients.clients[1].id,
          loadClients.clients[2].id]
      };

      await processCommands(addClientsToTrainer2, 'updateTrainersClients');

      for (let x of loadAppointments.appointments) {
        let command = loadAppointments.scheduleAppointment(x);
        await processCommands(command, 'scheduleAppointment');
      }

      for (let x of loadPurchases.purchases) {
        let command = loadPurchases.purchase(x);
        await processCommands(command, 'purchase');
      }
    };

    const begin = async function () {
      return await populateES();
    };

    return begin();
  };
};
