const trainerPayments = (mssql, eventstore, uuid, commands, R) => {
  return async () => {
    mssql = await mssql;

    // change query to get all trainers payments
    const results = await mssql.query` 
select tp.trainerId, tp.Total,tp.CreatedDate, tp.createdById, tps.ClientId, tps.AppointmentId, tps.trainerPaymentId from TrainerPayment tp 
inner join TrainerPaymentSessionItem tps on tp.entityId = tps.trainerPaymentId
 where convert(datetime, tp.createddate) > CONVERT(datetime, '2/1/2018')
`;

    const clientHash = {};
    const trainerHash = {};

    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));

    const payments = R.groupBy(x=>x.trainerPaymentId, results.recordset);
    Object.keys(payments).map(x => {
      const firstPayment = payments[x][0];
      const payment = {
        trainerId: trainerHash[firstPayment.trainerId],
        paymentTotal: firstPayment.total,
        datePaid: firstPayment.createdDate,
        createdDate: firstPayment.createdDate,
        createdById: trainerHash[firstPayment.createdById],
        migration: true
      };
      payment.paidAppointments = payments[x].map(p => ({clientId: clientHash[p.clientId], appointmentId: p.appointmentId}));
      return payment;
    });

    for (let x of payments) {
      const payTrainerCommand = commands.payTrainerCommmand(x);
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
