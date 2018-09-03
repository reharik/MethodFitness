const migrateClientSessions = (
  mssql,
  eventstore,
  uuid,
  commands,
  rsRepository,
  R,
) => {
  return async () => {
    mssql = await mssql;
    const clientSessions = await mssql.query`
      SELECT [Cost]
        ,[AppointmentType]
        ,[ClientId]
      FROM [MethodFitness_PROD].[dbo].[Session]
      where SessionUsed = 0
    `;

    const clientHash = {};
    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));

    for (let c of clients) {
      const legacyId = c.legacyId;
      if (legacyId) {
        const filtered = R.filter(
          x => x.ClientId === legacyId && clientHash[x.ClientId],
          clientSessions.recordset,
        );
        if (filtered.length > 0) {
          const sessions = R.groupBy(x => x.AppointmentType, filtered);

          const cmd = {
            clientId: clientHash[legacyId],
            fullHour: 0,
            fullHourTenPack: 0,
            fullHourTotal: 0,
            fullHourTenPackTotal: 0,
            totalFullHours: 0,
            halfHour: 0,
            halfHourTenPack: 0,
            halfHourTotal: 0,
            halfHourTenPackTotal: 0,
            totalHalfHours: 0,
            pair: 0,
            pairTenPack: 0,
            pairTotal: 0,
            pairTenPackTotal: 0,
            totalPairs: 0,
          };
          if (sessions.Hour) {
            const hours = sessions.Hour;
            const hourRate = hours.reduce((a, x) => (a += x.Cost), 0);
            cmd.fullHour = hours.length % 10;
            cmd.fullHourTenPack = Math.floor(hours.length / 10);
            cmd.fullHourTotal = (hours.length % 10) * hourRate;
            cmd.fullHourTenPackTotal = Math.floor(hours.length / 10) * hourRate;
            cmd.totalFullHours = hours.length;
          }
          if (sessions['Half Hour']) {
            const halfHours = sessions['Half Hour'];
            const halfHourRate = halfHours.reduce((a, x) => (a += x.Cost), 0);
            cmd.halfHour = halfHours.length % 10;
            cmd.halfHourTenPack = Math.floor(halfHours.length / 10);
            cmd.halfHourTotal = (halfHours.length % 10) * halfHourRate;
            cmd.halfHourTenPackTotal =
              Math.floor(halfHours.length / 10) * halfHourRate;
            cmd.totalHalfHours = halfHours.length;
          }
          if (sessions.Pair) {
            const pairs = sessions.Pair;
            const pairRate = pairs.reduce((a, x) => (a += x.Cost), 0);
            cmd.pair = pairs.length % 10;
            cmd.pairTenPack = Math.floor(pairs.length / 10);
            cmd.pairTotal = (pairs.length % 10) * pairRate;
            cmd.pairTenPackTotal = Math.floor(pairs.length / 10) * pairRate;
            cmd.totalPairs = pairs.length;
          }

          const command = commands.purchaseCommand(cmd);

          try {
            await eventstore.commandPoster(command, 'purchase', uuid.v4());
          } catch (ex) {
            console.log(`==========ex==========`);
            console.log(ex);
            console.log(`==========END ex==========`);
          }
        }
      }
    }
    console.log(`==========rows==========`);
    console.log(clientSessions.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = migrateClientSessions;
