const bootstrap = (
  migrateClients,
  migrateTrainers,
  migrateTrainersClients,
  migrateTrainersClientRates,
  migrateClientSessions,
  migrateFutureAppointments,
  migrateInarrersAppointments,
) => {
  return async () => {
    try {
      // await migrateClients();
      // await migrateTrainers();
      // await migrateTrainersClients();
      // await migrateTrainersClientRates();
      // await migrateClientSessions();
      await migrateFutureAppointments();
      // await migrateInarrersAppointments();
    } catch (err) {
      console.log(`==========err==========`);
      console.log(err);
      console.log(`==========END err==========`);
    }
  };
};

module.exports = bootstrap;
