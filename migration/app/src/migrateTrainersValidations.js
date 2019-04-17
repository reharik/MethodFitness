const trainerValidations = (
  mssql,
  rsRepository,
  eventstore,
  uuid,
  commands,
) => {
  return async () => {
    mssql = await mssql;

    // change query to get all trainers verifications( not doing it now because not sure if all "users" are trainers )
    const results = await mssql.query` 
select tp.entityIs as trainerPaymentId, tp.trainerId, tp.Total,tp.CreatedDate, tp.createdById, tps.ClientId, tps.sessionId from TrainerPayment tp 
inner join TrainerPaymentSessionItem tps on tp.entityId = tps.trainerPaymentId
 where convert(datetime, tp.createddate) > CONVERT(datetime, '2/1/2018')
`;

    const clientHash = {};
    const trainerHash = {};
    const sessionHash = {};

    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));

    const sessions = await rsRepository.query(
      'select * from sessionsPurchased',
    );
    sessions.forEach(s =>
      s.sessions.forEach(x => (sessionHash[x.legacyId] = x.sessionId)),
    );

    const verifications = R.groupBy(x => x.trainerPaymentId, results.recordset);

    Object.keys(verifications).map(x => {
      const firstVerification = verifications[x][0];
      const verification = {
        trainerId: trainerHash[firstVerification.trainerId],
        verifiedDate: firstVerification.createdDate,
        createdDate: firstVerification.createdDate,
        createdById: trainerHash[firstVerification.createdById],
        migration: true,
      };
      verification.sessionIds = verifications[x].map(
        s => sessionHash[s.sessionId],
      );
      return verification;
    });

    for (let x of verifications) {
      const trainerValidationCommand = commands.verifyAppointmentsCommand(x);
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

module.exports = trainerValidations;
