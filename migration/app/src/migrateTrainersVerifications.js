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
select EntityId,
		ChangedDate as VerifiedDate,
		TrainerId
 from session 
where TrainerVerified =1 
order by ChangedDate 
`;

    const trainerHash = {};
    const sessionHash = {};

    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));

    const sessions = await rsRepository.query(
      'select * from sessionsPurchased',
    );
    sessions.forEach(s =>
      s.sessions.forEach(x => (sessionHash[x.legacyId] = x.sessionId)),
    );

    const sessionsByTrainer = R.groupBy(x => x.TrainerId, results.recordset);

    const verificationCommands = Object.keys(sessionsByTrainer).map(key => {
      const grouped = R.groupBy(x=> x.VerifiedDate, sessionsByTrainer[key]);
      return Object.keys(grouped).map(gKey => {
        const groupedSessions = grouped[gKey];
        return commands.verifyAppointmentsCommand({
          trainerId: trainerHash[key],
          sessionIds: groupedSessions.map(s => sessionHash[s.EntityId]),
          verifiedDate: groupedSessions[0],
          createdDate: groupedSessions[0],
            createdById: trainerHash[key],
          migration: true,
        });
      });
    });


    for (let x of verificationCommands) {
      try {
        await eventstore.commandPoster(
          x,
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
