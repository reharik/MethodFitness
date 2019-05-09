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
    const halfHourPairClients = [
      2331,
      5895,
      2623,
      2633,
      2736,
      2737,
      3871,
      3872,
      5914,
      3873,
    ];

    mssql = await mssql;
    const clientSessions = await mssql.query`
 select s.EntityId,
		s.AppointmentType,
		s.PurchaseBatchNumber,
		s.ClientId,
		s.AppointmentId,
		s.TrainerId,
		s.CreatedDate,
		s.CreatedById,
		s.Cost,
		tps.TrainerPay,
		TrainerPercent = (tps.TrainerPay/s.Cost) * 100
 from Session s inner join TrainerPaymentSessionItem tps on s.AppointmentId = tps.AppointmentId
 where SessionUsed = 1 and InArrears = 0 and s.Cost > 0
`;

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
      const nullPurchaseOrderId = uuid.v4();
      const poKeys = Object.keys(clientPurchaseOrders);
      if (clientPurchaseOrders[null] || clientPurchaseOrders[undefined]) {
        clientPurchaseOrders[nullPurchaseOrderId] = [];
        clientPurchaseOrders[nullPurchaseOrderId].concat(
          clientPurchaseOrders[null] || [],
        );
        clientPurchaseOrders[nullPurchaseOrderId].concat(
          clientPurchaseOrders[undefined] || [],
        );
        console.log(`==========clientPurchaseOrders[nullPurchaseOrderId]==========`);
        console.log(clientPurchaseOrders[nullPurchaseOrderId]);
        console.log(`==========END clientPurchaseOrders[nullPurchaseOrderId]==========`);

      }
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
        const purchaseTotal = clientPurchaseOrders[legacyPOId].reduce(
          (a, b) => a.cost + b.cost,
          0,
        );
        const sessions = R.groupBy(
          x => x.AppointmentType,
          clientPurchaseOrders[legacyPOId],
        );
        const cmd = {
          clientId,
          fullHour: 0,
          fullHourTenPack: 0,
          fullHourPrice: 0,
          halfHour: 0,
          halfHourTenPack: 0,
          halfHourPrice: 0,
          pair: 0,
          pairTenPack: 0,
          pairPrice: 0,
          purchaseTotal,
          //TODO remove after migration
          fullHourAppointmentIds: [],
          halfHourAppointmentIds: [],
          pairAppointmentIds: [],
          halfHourPairAppointmentIds: [],
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
          cmd.fullHour = hours.length;
          cmd.fullHourAppointmentIds = hours.map(x => ({
            cost: x.Cost,
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
            trainerPercent: x.TrainerPercentage,
            trainerPay: x.TrainerPay,
          }));
        }
        if (sessions['Half Hour']) {
          const halfHours = sessions['Half Hour'];
          cmd.halfHour = halfHours.length;
          cmd.halfhHourAppointmentIds = halfHours.map(x => ({
            cost: x.Cost,
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
            trainerPercent: x.TrainerPercentage,
            trainerPay: x.TrainerPay,
          }));
        }
        if (sessions.Pair) {
          sessions.HalfHourPair = sessions.Pair.filter(x =>
            halfHourPairClients.includes(x.ClientId),
          );
          const pairs = sessions.Pair.filter(
            x => !halfHourPairClients.includes(x.ClientId),
          );

          cmd.pair = pairs.length;
          cmd.pairAppointmentIds = pairs.map(x => ({
            cost: x.Cost,
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
            trainerPercent: x.TrainerPercentage,
            trainerPay: x.TrainerPay,
          }));
        }

        if (sessions.HalfHourPair) {
          const halfHourPair = sessions.HalfHourPair;
          cmd.halfHourPair = halfHourPair.length;
          cmd.halfHourPairAppointmentIds = halfHourPair.map(x => ({
            cost: x.Cost,
            legacyAppointmentId: x.AppointmentId,
            legacyId: x.EntityId,
            trainerPercent: x.TrainerPercentage,
            trainerPay: x.TrainerPay,
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
