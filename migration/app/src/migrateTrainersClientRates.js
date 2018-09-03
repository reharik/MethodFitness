const migrateTrainersClientRates = (
  mssql,
  eventstore,
  uuid,
  commands,
  rsRepository,
) => {
  return async () => {
    mssql = await mssql;
    const trainerClientRates = await mssql.query`
      select * from trainerClientRate    
    `;

    const clientHash = {};
    const trainerHash = {};

    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));

    for (let t of trainers) {
      const legacyId = t.legacyId;
      if (legacyId) {
        const legacyRates = trainerClientRates.recordset
          .filter(
            x => x.TrainerId === legacyId && clientHash[x.ClientId] !== null,
          )
          .map(x => ({ clientId: x.ClientId, rate: x.Percent }));
        const rates = legacyRates
          .filter(x => clientHash[x.ClientId])
          .map(x => ({
            clientId: clientHash[x.ClientId],
            rate: x.rate,
          }));

        const command = commands.updateTrainersClientRatesCommand({
          trainerId: t.trainerId,
          clientRates: rates,
        });

        try {
          await eventstore.commandPoster(
            command,
            'updateTrainersClientRates',
            uuid.v4(),
          );
        } catch (ex) {
          console.log(`==========ex==========`);
          console.log(ex);
          console.log(`==========END ex==========`);
        }
      }
    }
    // console.log(`==========rows==========`);
    // console.log(trainerClientList.rowsAffected);
    // console.log(`==========END rows==========`);
  };
};

module.exports = migrateTrainersClientRates;
