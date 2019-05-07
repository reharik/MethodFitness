const trainers = (
  mssql,
  eventstore,
  notificationListener,
  notificationParser,
  uuid,
  R,
  rsRepository,
  commands,
) => {
  return async () => {
    mssql = await mssql;

    // change query to get all trainers ( not doing it now because not sure if all "users" are trainers )
    const results = await mssql.query`select * from [User]`;
    //     where EntityId in (
    // 1,
    // 3,
    // 13,
    // 22,
    // 28,
    // 29,
    // 30,
    // 32)
    // `;
    const lastId = results.recordset[results.recordset.length - 1].EntityId;

    const trainerClientList = await mssql.query`select * from user_client`;
    const TCRs = await mssql.query`
      select * from trainerClientRate    
    `;

    const clientHash = {};
    rsRepository = await rsRepository;
    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));

    const trainersClients = R.groupBy(
      x => x.UserId,
      trainerClientList.recordset,
    );

    Object.keys(trainersClients).forEach(x => {
      trainersClients[x] = trainersClients[x].map(
        tc => clientHash[tc.ClientId],
      );
    });

    const trainerClientRates = R.groupBy(x => x.TrainerId, TCRs.recordset);
    Object.keys(trainerClientRates).forEach(x => {
      trainerClientRates[x] = trainerClientRates[x].map(tcr => ({
        clientId: clientHash[tcr.ClientId],
        rate: tcr.Percent,
      }));
    });

    for (let x of results.recordset) {
      let newVar = {
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
        clients: trainersClients[x.EntityId] || [],
        defaultTrainerClientRate: x.ClientRateDefault || 65,
        trainerClientRates: trainerClientRates[x.EntityId] || [],
        createdDate: x.CreatedDate,
        createdById: x.CreatedById,
        migration: true,
      };
      const trainerCommand = commands.hireTrainerCommand(newVar);

      try {
        let continuationId = uuid.v4();
        let notificationPromise;
        if (x.EntityId === lastId) {
          notificationPromise = await notificationListener(continuationId);
        }

        await eventstore.commandPoster(
          trainerCommand,
          'hireTrainer',
          continuationId,
        );
        if (x.EntityId === lastId) {
          const result = await notificationParser(notificationPromise);
          console.log(`==========result==========`);
          console.log(result);
          console.log(`==========END result==========`);
        }
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
