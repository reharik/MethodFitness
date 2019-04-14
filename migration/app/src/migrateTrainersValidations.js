const trainerValidations = (mssql, eventstore, uuid, commands) => {
  return async () => {
    mssql = await mssql;

    // change query to get all trainers verifications( not doing it now because not sure if all "users" are trainers )
    const results = await mssql.query` 
	select * from [User] where EntityId in (
1,
3,
13,
22,
28,
29,
30,
32)
`;
    for (let x of results.recordset) {
      const trainerValidationCommand = commands.verifyAppointmentsCommand({
        trainerId: undefined // match up legacy with new
        sessionIds: x.sessionIds, // this is probably the wrong prop
        verifideDate: x.verifideDate, // this is probably the wrong prop
        createdDate: x.createdDate,
        createdById: x.createdById,
        migration: true
      });

      try {
        await eventstore.commandPoster(
          trainerValidationCommand,
          'verifyAppointments',
          uuid.v4(),
        );
      } catch (ex) {
        console.log(`==========ex==========`);
        console.log(ex);
        console.log(`==========END ex==========`);
      }
    }
    console.log(`==========rows==========`);
    console.log(results.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = trainers;
