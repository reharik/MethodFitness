const migrateClientSessions = (
  mssql,
  eventstore,
  notificationListener,
  notificationParser,
  uuid,
  commands,
  rsRepository,
  R,
) => {
  return async () => {
    mssql = await mssql;
    const clientSessions = await mssql.query`
    SELECT *
      FROM [MethodFitness_PROD].[dbo].[Session]`;

    //   where NOT inArrears = 1 AND CreatedDate > CONVERT(datetime, '2/1/2018')
    // `;

    const sessionsByLegacyId = R.groupBy(
      x => x.ClientId,
      clientSessions.recordset,
    );

    const clientHash = {};
    rsRepository = await rsRepository;
    const clients = await rsRepository.query('select * from client');
    clients
      .filter(x => x.legacyId)
      .forEach(x => (clientHash[x.legacyId] = x.clientId));

    const keys = Object.keys(sessionsByLegacyId);

    const lastClient = keys[keys.length - 1];

    for (let key of keys) {
      const clientPurchaseOrders = R.groupBy(
        s => s.PurchaseBatchNumber,
        sessionsByLegacyId[key],
      );
      const poKeys = Object.keys(clientPurchaseOrders);
      let lastPOId;
      if (key === lastClient) {
        lastPOId = poKeys[poKeys.length - 1];
      }

      const clientId = clientHash[key];
      // console.log(`==========clientId==========`);
      // console.log(key);
      // console.log(clientHash);
      // console.log(`==========END clientId==========`);

      for (let legacyPOId of poKeys) {
        const sessions = R.groupBy(
          x => x.AppointmentType,
          clientPurchaseOrders[legacyPOId],
        );
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
          fullHourAppointmentIds: [],
          halfHourAppointmentIds: [],
          pairAppointmentIds: [],
          // because sessions is grouped by type
          createdDate: clientPurchaseOrders[legacyPOId][0].CreatedDate,
          createdById: clientPurchaseOrders[legacyPOId][0].CreatedById,
          migration: true,
          legacyId: legacyPOId,
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
          cmd.fullHourAppointmentIds = hours.map(x => ({
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
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
          cmd.halfhHourAppointmentIds = halfHours.map(x => ({
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
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
          cmd.pairAppointmentIds = pairs.map(x => ({
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
          }));
        }

        const command = commands.purchaseCommand(cmd);

        try {
          let continuationId = uuid.v4();
          let notificationPromise;
          if (cmd.legacyId === lastPOId) {
            notificationPromise = await notificationListener(continuationId);
          }
          await eventstore.commandPoster(command, 'purchase', continuationId);
          if (cmd.legacyId === lastPOId) {
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
    }
    console.log(`==========rows==========`);
    console.log(clientSessions.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = migrateClientSessions;
