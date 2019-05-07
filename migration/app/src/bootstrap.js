const bootstrap = (
  migrateLocations,
  migrateClients,
  migrateTrainers,
  migrateClientSessions,
  // migrateFutureAppointments,
  migratePastAppointments,
  migrateTrainersValidations,
  migrateTrainersPayments,
) => {
  return async () => {
    try {
      const start = Date.now();
      console.log('starting timer...');
      await migrateLocations();

      /////////////
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

      //////////////
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

      ////////////////
      const pastApointmentsStart = Date.now();
      await migratePastAppointments();
      var pastApointmentsMillis = Date.now() - pastApointmentsStart;
      console.log(
        `=========="past appointment seconds elapsed = " + Math.floor(millis/1000)==========`,
      );
      console.log(
        `past appointment seconds elapsed =  ${Math.floor(
          pastApointmentsMillis / 1000,
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
