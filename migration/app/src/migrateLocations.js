const locations = (
  mssql,
  eventstore,
  notificationListener,
  notificationParser,
  uuid,
  commands,
) => {
  return async () => {
    mssql = await mssql;

    const results = await mssql.query`select * from location`;

    const lastId = results.recordset[results.recordset.length - 1].EntityId;
    for (let x of results.recordset) {
      const locationCommand = commands.addLocationCommand({
        name: x.Name,
        archived: false,
        legacyId: x.EntityId,
        createdByDate: x.CreatedByDate,
        createdById: x.CreatedById,
      });
      try {
        let continuationId = uuid.v4();
        let notificationPromise;
        if (x.EntityId === lastId) {
          notificationPromise = await notificationListener(continuationId);
        }
        await eventstore.commandPoster(
          locationCommand,
          'addLocation',
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

module.exports = locations;
