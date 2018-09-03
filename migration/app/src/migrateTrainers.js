const trainers = (mssql, eventstore, uuid, commands) => {
  return async () => {
    mssql = await mssql;

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
        clients: x.clients ? x.clients.split(',') : [],
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
