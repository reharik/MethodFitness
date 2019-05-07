module.exports = function(
  config,
  uuid,
  eventstore,
  loadClients,
  loadLocations,
  loadTrainers,
  loadDefaultClientRates,
  loadPurchases,
  loadAppointments,
) {
  return function() {
    const processCommands = async function(command, commandName) {
      await eventstore.commandPoster(command, commandName, uuid.v4());
    };

    const populateES = async function() {
      console.log('=========="begin seed"=========');
      console.log('begin seed');
      console.log('==========END "begin seed"=========');

      for (let x of loadLocations.locations) {
        let command = loadLocations.addLocation(x);
        await processCommands(command, 'addLocation');
      }

      for (let x of loadClients.clients) {
        let command = loadClients.addClient(x);
        await processCommands(command, 'addClient');
      }

      for (let x of loadTrainers.trainers) {
        let command = loadTrainers.addTrainer(x);
        await processCommands(command, 'hireTrainer');
      }

      const xxx = loadDefaultClientRates.defaultClientRates;
      console.log(`==========xxx==========`);
      console.log(xxx);
      console.log(`==========END xxx==========`);

      let command = loadDefaultClientRates.addDefaultClientRates(xxx);
      await processCommands(command, 'updateDefaultClientRates');

      // for (let x of loadAppointments.appointments) {
      //   let command = loadAppointments.scheduleAppointment(x);
      //   await processCommands(command, 'scheduleAppointment');
      // }

      // for (let x of loadPurchases.purchases) {
      //   let command = loadPurchases.purchase(x);
      //   await processCommands(command, 'purchase');
      // }

      console.log('=========="End Seed"=========');
      console.log('End Seed');
      console.log('==========END "End Seed"=========');
    };

    const begin = async function() {
      return await populateES();
    };

    return begin();
  };
};
