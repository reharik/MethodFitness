const trainers = (mssql, eventstore, uuid, R, commands) => {
  return async () => {
    mssql = await mssql;

    // change query to get all trainers ( not doing it now because not sure if all "users" are trainers )
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

    const trainerClientList = await mssql.query`select * from user_client`;
    const TCRs = await mssql.query`
      select * from trainerClientRate    
    `;

    const clientHash = {};

    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));

    const trainersClients = R.groupBy(x => x.UserId, trainerClientList.recordset);
    Object.keys(trainersClients).forEach(x => {
      trainersClients[x] = trainersClients[x].map(tc => clientHash[tc.ClientID])
    });

    const trainerClientRates = R.groupBy(x => x.TrainerId, TCRs.recordset);
    Object.keys(trainerClientRates).forEach(x => {
      trainerClientRates[x] = trainerClientRates[x].map(tcr => ({clientId:clientHash[tcr.ClientID], rate:tcr.Percent}))
    });

    for (let x of results.recordset) {
      const trainerCommand = commands.hireTrainerCommand({
        birthDate: x.BirthDate,
        archived: x.Archived,
        legacyId: x.EntityId,
        color: x.Color,
        contact: {
          firstName: x.FirstName,
          lastName: x.LastName,
          mobilePhone: x.MobilePhone || '555-555-5555',
          secondaryPhone: x.SecondaryPhone,
          email: x.Email || 'change_me',
          address: {
            street1: x.Address1,
            street2: x.Address2,
            city: x.City,
            state: x.State,
            zipCode: x.ZipCode,
          },
        },
        credentials: {
          role: 'trainer',
          password: 'change_me',
        },
        clients: trainersClients[x.entityId] || [],
        defaultTrainerClientRate:x.clientRateDefault,
        trainerClientRates,
        createdDate: x.createdDate,
        createdById: x.createdById,
        migration: true
      });

      try {
        await eventstore.commandPoster(
          trainerCommand,
          'hireTrainer',
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
