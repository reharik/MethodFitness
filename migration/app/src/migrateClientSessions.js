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
    SELECT *
      FROM [MethodFitness_PROD].[dbo].[Session]
      where NOT inarrears = 1 AND CreatedDate > CONVERT(datetime, '2/1/2018')
    `;

    const purchaseOrdersByLegacyId = R.groupBy(x => x.clientId, clientSessions);
    Object.keys(purchaseOrdersByLegacyId).forEach(x =>
      Object.values(
        R.groupBy(s => s.purchaseOrderNumber, purchaseOrdersByLegacyId[x]),
      ),
    );

    const clientHash = {};
    rsRepository = await rsRepository;
    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));

    const keys = Object.keys(purchaseOrdersByLegacyId);
    for (let key of keys) {
      const clientId = clientHash[key];
      const purchaseOrders = purchaseOrdersByLegacyId[key];
      for (let po of purchaseOrders) {
        const sessions = R.groupBy(x => x.AppointmentType, po);
        const cmd = {
          clientId,
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
          //TODO remove after migration
          HourAppointmentIds: [],
          Half_HourAppointmentIds: [],
          PairsAppointmentIds: [],
          createdDate: x.createdDate,
          createdById: x.createdById,
          migration: true,
        };

        //TODO remove after migration
        // need to add a list of appointmentIds for each type then in workflow, apply them all when creating sessions. uggg
        if (sessions.Hour) {
          const hours = sessions.Hour;
          const hourRate = hours.reduce((a, x) => (a += x.Cost), 0);
          cmd.fullHour = hours.length % 10;
          cmd.fullHourTenPack = Math.floor(hours.length / 10);
          cmd.fullHourTotal = (hours.length % 10) * hourRate;
          cmd.fullHourTenPackTotal = Math.floor(hours.length / 10) * hourRate;
          cmd.totalFullHours = hours.length;
          cmd.HourAppointmentIds = sessions.hour.map(x => ({
            appointmentId: x.appointmentId,
            legacyId: x.sessionId,
          }));
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
          cmd.Half_HourAppointmentIds = sessions['Half Hour'].map(x => ({
            appointmentId: x.appointmentId,
            legacyId: x.sessionId,
          }));
        }
        if (sessions.Pair) {
          const pairs = sessions.Pair;
          const pairRate = pairs.reduce((a, x) => (a += x.Cost), 0);
          cmd.pair = pairs.length % 10;
          cmd.pairTenPack = Math.floor(pairs.length / 10);
          cmd.pairTotal = (pairs.length % 10) * pairRate;
          cmd.pairTenPackTotal = Math.floor(pairs.length / 10) * pairRate;
          cmd.totalPairs = pairs.length;
          cmd.PairsAppointmentIds = sessions.pairs.map(x => ({
            appointmentId: x.appointmentId,
            legacyId: x.sessionId,
          }));
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
    console.log(`==========rows==========`);
    console.log(clientSessions.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = migrateClientSessions;
