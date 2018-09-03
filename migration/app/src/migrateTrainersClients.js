const migrateTrainersClients = (
  mssql,
  eventstore,
  uuid,
  commands,
  rsRepository,
) => {
  return async () => {
    mssql = await mssql;

    const trainerClientList = await mssql.query`select * from user_client`;

    const clientHash = {};
    const trainerHash = {};

    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));

    for (let t of trainers) {
      const legacyId = t.legacyId;
      if (legacyId) {
        const commandProps = trainerClientList.recordset
          .filter(x => x.UserId === legacyId && clientHash[x.ClientId])
          .reduce(
            (a, x) => {
              a.clients.push(clientHash[x.ClientId]);
              return a;
            },
            {
              trainerId: t.trainerId,
              clients: [],
            },
          );

        const command = commands.updateTrainersClientsCommand(commandProps);

        try {
          await eventstore.commandPoster(
            command,
            'updateTrainersClients',
            uuid.v4(),
          );
        } catch (ex) {
          console.log(`==========ex==========`);
          console.log(ex);
          console.log(`==========END ex==========`);
        }
      }
    }
    console.log(`==========rows==========`);
    console.log(trainerClientList.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = migrateTrainersClients;
