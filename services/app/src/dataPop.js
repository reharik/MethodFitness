module.exports = function(rsRepository,
                          eventstore,
                          commands,
                          moment,
                          uuid,
                          logger,
                          mssql) {
  return async() => {

    try {
      console.log(`==========moment.format('LT'=========`);
      console.log(moment().format('LTS'));
      console.log(`==========END moment.format('LT'=========`);
      await mssql.connect('mssql://methodFitness:m3th0d@cannibalcoder.cloudapp.net/MethodFitness_PROD');
      const clients = await mssql.query`select * from client`;
      let clientCmds = [];
      let clientIdsMap = {};
      clients.recordset.forEach(x => {
        const id = uuid.v4();
        clientIdsMap[x.EntityId] = id;
        clientCmds.push(commands.addClientCommand({
          id,
          migrationId: x.EntityId,
          source: x.Source,
          startDate: x.StartDate,
          sourceNotes: x.SourceOther ? x.SourceOther.trim() : '',
          birthDate: x.BirthDate,
          archived: x.Archived,
          contact: {
            firstName: x.FirstName ? x.FirstName.trim() : '',
            lastName: x.LastName ? x.LastName.trim() : '',
            secondaryPhone: x.SecondaryPhone ? x.SecondaryPhone.trim() : '',
            mobilePhone: x.MobilePhone ? x.MobilePhone.trim() : '',
            email: x.Email ? x.Email.trim() : '',
            address: {
              street1: x.Address1 ? x.Address1.trim() : '',
              street2: x.Address2 ? x.Address2.trim() : '',
              city: x.City ? x.City.trim() : '',
              state: x.State,
              zipCode: x.ZipCode ? x.ZipCode.trim() : ''
            }
          }
        }));
      });

      const trainers = await mssql.query`select * from [user]`;
      let trainerCmds = [];
      let trainerIdsMap = {};
      trainers.recordset.forEach(x => {
        const id = uuid.v4();
        trainerIdsMap[x.EntityId] = id;
        trainerCmds.push(commands.hireTrainerCommand({
          id,
          migrationId: x.EntityId,
          sourceNotes: x.SourceOther ? x.SourceOther.trim() : '',
          birthDate: x.BirthDate,
          archived: x.Archived,
          contact: {
            firstName: x.FirstName ? x.FirstName.trim() : '',
            lastName: x.LastName ? x.LastName.trim() : '',
            secondaryPhone: x.SecondaryPhone ? x.SecondaryPhone.trim() : '',
            mobilePhone: x.MobilePhone ? x.MobilePhone.trim() : '',
            email: x.Email ? x.Email.trim() : '',
            address: {
              street1: x.Address1 ? x.Address1.trim() : '',
              street2: x.Address2 ? x.Address2.trim() : '',
              city: x.City ? x.City.trim() : '',
              state: x.State,
              zipCode: x.ZipCode ? x.ZipCode.trim() : ''
            }
          },
          credentials: {
            role: 'trainer'
          }
        }));
      });

      const tcr = await mssql.query`select * from trainerClientRate`;
      let newTcrs = {};
      const tcrs = tcr.recordset;
      tcrs.forEach(cr => {
        if (!cr.TrainerId || !cr.ClientId || !cr.Percent) {
          return;
        }
        let trainerId = trainerIdsMap[cr.TrainerId];
        if (!newTcrs[trainerId]) {
          trainerCmds.find(c => c.id === trainerId).clients = tcrs
            .filter(x => trainerIdsMap[x.TrainerId] === trainerId)
            .map(x => clientIdsMap[x.ClientId]);

          newTcrs[trainerId] = commands.updateTrainersClientRatesCommand(
            {
              id: trainerId,
              clientRates: tcrs
                .filter(x => trainerIdsMap[x.TrainerId] === trainerId)
                .map(x => ({id: clientIdsMap[x.ClientId], rate: x.Percent}))
            });
        }
      });


      // const convertType = type => {
      //   switch (type) {
      //     case 'Hour': {
      //       return 'fullHour';
      //     }
      //     case 'Half Hour': {
      //       return 'halfHour';
      //     }
      //     case 'Pair': {
      //       return 'pair';
      //     }
      //     case 'Hour TenPack': {
      //       return 'fullHourTenPack';
      //     }
      //     case 'Half HourTenPack': {
      //       return 'halfHourTenPack';
      //     }
      //     case 'PairTenPack': {
      //       return 'pairTenPack';
      //     }
      //     case 'HourTotal': {
      //       return 'fullHourTotal';
      //     }
      //     case 'Half HourTotal': {
      //       return 'halfHourTotal';
      //     }
      //     case 'PairTotal': {
      //       return 'pairTotal';
      //     }
      //     case 'Hour TenPackTotal': {
      //       return 'fullHourTenPackTotal';
      //     }
      //     case 'Half HourTenPackTotal': {
      //       return 'halfHourTenPackTotal';
      //     }
      //     case 'PairTenPackTotal': {
      //       return 'pairTenPackTotal';
      //     }
      //   }
      //   return '';
      // };
      // const sessions = await mssql.query`select * from session where SessionUsed = 0 or SessionUsed is NULL`;
      // let purchases = sessions.recordset.reduce((a, b) => {
      //   let purchase = a[clientIdsMap[b.ClientId]] || {clientId: clientIdsMap[b.ClientId]};
      //   purchase[convertType(b.AppointmentType)] = purchase[convertType(b.AppointmentType)] || 0;
      //   purchase[convertType(b.AppointmentType)] += 1;
      //   purchase[`${convertType(b.AppointmentType)}Total`] = purchase[`${convertType(b.AppointmentType)}Total`] || 0;
      //   purchase[`${convertType(b.AppointmentType)}Total`] += b.Cost;
      //   if (purchase[convertType(b.AppointmentType)] === 10) {
      //     purchase[`${convertType(b.AppointmentType)}TenPack`]
      //       = purchase[`${convertType(b.AppointmentType)}TenPack`] || 0;
      //     purchase[`${convertType(b.AppointmentType)}TenPackTotal`]
      //       = purchase[`${convertType(b.AppointmentType)}TenPackTotal`] || 0;
      //     purchase[`${convertType(b.AppointmentType)}TenPack`] += 1;
      //     purchase[`${convertType(b.AppointmentType)}TenPackTotal`]
      //       = purchase[`${convertType(b.AppointmentType)}TenPackTotal`]
      //       + purchase[`${convertType(b.AppointmentType)}Total`];
      //     purchase[`${convertType(b.AppointmentType)}Total`] = 0;
      //     purchase[`${convertType(b.AppointmentType)}`] = 0;
      //   }
      //
      //   a[clientIdsMap[b.ClientId]] = purchase;
      //   return a;
      // }, {});
      // let purchaseCommands = Object.values(purchases).map(x => {
      //   x.totalFullHours = (x.fullHour || 0) + ((x.fulllHourTenPack || 0) * 10);
      //   x.totalHalfHours = (x.halfHour || 0) + ((x.halfHourTenPack || 0) * 10);
      //   x.totalPairs = (x.pair || 0) + ((x.pairTenPack || 0) * 10);
      //   return commands.purchaseCommand(x);
      // });


      const archiveClients = await mssql.query`SELECT  c.EntityId as clientId
FROM    client c INNER JOIN ( 
select c.entityId as clientId, MAX(a.date) date from client c 
inner join appointment_client ac on c.entityId = ac.clientId 
inner join appointment a on ac.appointmentId = a.entityId 
group by c.entityId
        ) a ON c.entityId = a.clientId
       where a.Date < ${moment().subtract(3, 'months').toISOString()}`;

      archiveClients.recordset.forEach(x => clientCmds.find(c => c.id === clientIdsMap[x.clientId]).archived = true);
      // console.log(`==========archiveClients=========`);
      // console.log(clientCmds);
      // console.log(`==========END archiveClients=========`);
      // console.log(`==========trainerCmds=========`);
      // console.log(trainerCmds);
      // console.log(`==========END trainerCmds=========`);
      for (let c of clientCmds) {
        await eventstore.commandPoster(c, c.commandName, uuid.v4());
      }

      for (let c of trainerCmds) {
        await eventstore.commandPoster(c, c.commandName, uuid.v4());
      }

      for (let c of Object.values(newTcrs)) {
        await eventstore.commandPoster(c, c.commandName, uuid.v4());
      }

      console.log(`==========moment.format('LT'=========`);
      console.log(moment().format('LTS'));
      console.log(`==========END moment.format('LT'=========`);


    } catch (err) {
      console.log(`==========err=========`);
      console.log(err);
      console.log(`==========END err=========`);
    }
  };
};
