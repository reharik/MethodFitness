module.exports = function(config,
                          uuid,
                          eventstore,
                          loadClients,
                          loadTrainers,
                          loadPurchases,
                          loadAppointments) {
  return function() {
    const processCommands = async function(command, commandName) {
      await eventstore.commandPoster(
        command,
        commandName,
        uuid.v4());
    };

    const populateES = async function() {
      console.log('=========="begin seed"=========');
      console.log("begin seed");
      console.log('==========END "begin seed"=========');

      for (let x of loadClients.clients) {
        let command = loadClients.addClient(x);
        await processCommands(command, 'addClient');
      }

      for (let x of loadTrainers.trainers) {
        let command = loadTrainers.addTrainer(x);
        await processCommands(command, 'hireTrainer');
      }

      const addClientsToTrainer1 = {
        trainerId: loadTrainers.trainers[0].trainerId,
        clients: [
          loadClients.clients[0].clientId,
          loadClients.clients[1].clientId,
          loadClients.clients[2].clientId,
          loadClients.clients[3].clientId,
          loadClients.clients[4].clientId]
      };

      await processCommands(addClientsToTrainer1, 'updateTrainersClients');

      const addClientsToTrainer2 = {
        trainerId: loadTrainers.trainers[1].trainerId,
        clients: [
          loadClients.clients[0].clientId,
          loadClients.clients[1].clientId,
          loadClients.clients[2].clientId,
          loadClients.clients[3].clientId,
          loadClients.clients[4].clientId]
      };
      await processCommands(addClientsToTrainer2, 'updateTrainersClients');

      const addClientsToTrainer3 = {
        trainerId: loadTrainers.trainers[2].trainerId,
        clients: [
          loadClients.clients[0].clientId,
          loadClients.clients[1].clientId,
          loadClients.clients[2].clientId,
          loadClients.clients[3].clientId,
          loadClients.clients[4].clientId]
      };

      await processCommands(addClientsToTrainer3, 'updateTrainersClients');

      // for (let x of loadAppointments.appointments) {
      //   let command = loadAppointments.scheduleAppointment(x);
      //   await processCommands(command, 'scheduleAppointment');
      // }

      // for (let x of loadPurchases.purchases) {
      //   let command = loadPurchases.purchase(x);
      //   await processCommands(command, 'purchase');
      // }

      console.log('=========="End Seed"=========');
      console.log("End Seed");
      console.log('==========END "End Seed"=========');

    };

    const begin = async function() {
      return await populateES();
    };

    return begin();
  };
};
