const trainerPayments = (mssql, eventstore, uuid, commands) => {
  return async () => {
    mssql = await mssql;

    // change query to get all trainers payments
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
      const payTrainerCommand = commands.payTrainerCommmand({
        trainerId: undefined // match up legacy with new
        paidAppointments: x.paidAppointments, // this is probably the wrong prop
        paymentTotal: x.paymentTotal, // this is probably the wrong prop
        datePaid: x.datePaid,  // this is probably the wrong prop
        createdDate: x.createdDate,
        createdById: x.createdById,
        migration: true
      });

      try {
        await eventstore.commandPoster(
          payTrainerCommand,
          'payTrainer',
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

module.exports = trainerPayments;
