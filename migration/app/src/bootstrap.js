const bootstrap = (
  migrateClients,
  migrateTrainers,
  migrateTrainersClients,
  migrateTrainersClientRates,
  migrateClientSessions,
  migrateFutureAppointments,
  migratePastAppointments,
  migrateTrainerValidations,
  migrateTrainerPayments
) => {
  return async () => {
    try {
      // await migrateClients();
      // await migrateTrainers();
      // await migrateTrainersClients();
      // await migrateTrainersClientRates();
      // await migrateClientSessions();
      await migrateFutureAppointments();
      // await migratePastAppointments();
      // await migrateTrainerValidations();
      // await migrateTrainerPayments();
    } catch (err) {
      console.log(`==========err==========`);
      console.log(err);
      console.log(`==========END err==========`);
    }
  };
};

module.exports = bootstrap;
