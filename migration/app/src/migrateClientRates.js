const clientRates = (
  mssql,
  eventstore,
  rsRepository,
  notificationListener,
  notificationParser,
  uuid,
  commands,
) => {
  return async () => {
    mssql = await mssql;

    const results = await mssql.query`
select c.entityId as ClientId,
   [FullHour]
      ,[HalfHour]
      ,[FullHourTenPack]
      ,[HalfHourTenPack]
      ,[Pair]
      ,[PairTenPack]
      ,[HalfHourPair]=35
      ,[HalfHourPairTenPack]=300
      ,[HalfHourGroup]=30
      ,[HalfHourGroupTenPack]=250
      ,[FullHourGroup]=40
      ,[FullHourGroupTenPack]=400
      ,FortyFiveMinute=50
      ,[FortyFiveMinuteTenPack]=500
      ,sr.createdDate
      ,sr.CreatedById
 from sessionrates sr inner join Client c on c.sessionratesid = sr.entityId
`;

    rsRepository = await rsRepository;
    const clientHash = {};
    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x));

    const trainerHash = {};
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));


    const lastId = results.recordset[results.recordset.length - 1].ClientId;
    for (let x of results.recordset) {
      let cmd = {
        clientId: clientHash[x.ClientId].clientId,
        fullHourTenPack: x.FullHourTenPack || clientHash[x.ClientId].clientRates.fullHourTenPack,
        fullHour: x.FullHour || clientHash[x.ClientId].clientRates.fullHour,
        halfHourTenPack: x.HalfHourTenPack || clientHash[x.ClientId].clientRates.halfHourTenPack,
        halfHour: x.HalfHour || clientHash[x.ClientId].clientRates.halfHour,
        pairTenPack: x.PairTenPack || clientHash[x.ClientId].clientRates.pairTenPack,
        pair: x.Pair || clientHash[x.ClientId].clientRates.pair,
        halfHourPairTenPack: x.HalfHourPairTenPack,
        halfHourPair: x.HalfHourPair,
        fullHourGroupTenPack: x.FullHourGroupTenPack,
        fullHourGroup: x.FullHourGroup,
        halfHourGroupTenPack: x.HalfHourGroupTenPack,
        halfHourGroup: x.HalfHourGroup,
        fortyFiveMinuteTenPack: x.FortyFiveMinuteTenPack,
        fortyFiveMinute: x.FortyFiveMinute,
        createdDate: x.CreatedDate,
        createdById: trainerHash[x.CreatedById],
        migration: true,
      };
      const clientCommand = commands.updateClientRatesCommand(cmd);
      try {
        let continuationId = uuid.v4();
        let notificationPromise;
        if (x.ClientId === lastId) {
          notificationPromise = await notificationListener(continuationId);
        }
        await eventstore.commandPoster(
          clientCommand,
          'updateClientRates',
          continuationId,
        );
        if (x.ClientId === lastId) {
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

module.exports = clientRates;
