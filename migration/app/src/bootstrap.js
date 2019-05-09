const bootstrap = (
  migrateLocations,
  migrateClients,
  migrateTrainers,
  migrateClientSessions,
  // migrateFutureAppointments,
  migratePastAppointments,
  migrateTrainersValidations,
  migrateTrainersPayments,
  migrateClientRates,
) => {
  return async () => {
    try {
      const start = Date.now();
      console.log('starting timer...');

      /////////////
      // LOCATIONS
      await migrateLocations();

      /////////////
      // CLIENTS
      const clientStart = Date.now();
      await migrateClients();
      var clientMillis = Date.now() - clientStart;
      console.log(
        `=========="clients seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(
        `clients seconds elapsed =  ${Math.floor(clientMillis / 1000)}`,
      );
      console.log(
        `==========END "clients seconds elapsed = " + Math.floor(millis/1000)==========`,
      );

      //////////////////
      // TRAINERS
      const trainerStart = Date.now();
      await migrateTrainers();
      var trainerMillis = Date.now() - trainerStart;
      console.log(
        `=========="trainer seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(
        `trainer seconds elapsed =  ${Math.floor(trainerMillis / 1000)}`,
      );
      console.log(
        `==========END "trainer seconds elapsed = " + Math.floor(millis/1000)==========`,
      );

      /////////////
      // CLIENT RATES
      const clientRatesStart = Date.now();
      await migrateClientRates();
      var clientRatesMillis = Date.now() - clientRatesStart;
      console.log(
        `=========="client rates seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(
        `client rates seconds elapsed =  ${Math.floor(clientRatesMillis / 1000)}`,
      );
      console.log(
        `==========END "client rates seconds elapsed = " + Math.floor(millis/1000)==========`,
      );

      ////////////////
      // SESSIONS
      const sessionsStart = Date.now();
      await migrateClientSessions();
      var sessionsMillis = Date.now() - sessionsStart;
      console.log(
        `=========="client sessions seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(
        `client sessions seconds elapsed =  ${Math.floor(
          sessionsMillis / 1000,
        )}`,
      );
      console.log(
        `==========END "client sessions seconds elapsed = " + Math.floor(millis/1000)==========`,
      );

      // // await migrateFutureAppointments();

      //////////////
      // PAST APPOINTMENTS
      const pastAppointmentsStart = Date.now();
      await migratePastAppointments();
      const pastAppointmentsMillis = Date.now() - pastAppointmentsStart;
      console.log(
        `=========="past appointment seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(
        `past appointment seconds elapsed =  ${Math.floor(
          pastAppointmentsMillis / 1000,
        )}`,
      );
      console.log(
        `==========END "past appointment seconds elapsed = " + Math.floor(millis/1000)==========`,
      );

      /////////////////
      // await migrateTrainerValidations();
      // await migrateTrainerPayments();
      var millis = Date.now() - start;
      console.log(
        `=========="Total seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(`Total seconds elapsed =  ${Math.floor(millis / 1000)}`);
      console.log(
        `==========END "Total seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
    } catch (err) {
      console.log(`==========err==========`);
      console.log(err);
      console.log(`==========END err==========`);
    }
  };
};

module.exports = bootstrap;
