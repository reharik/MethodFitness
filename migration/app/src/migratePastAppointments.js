const migratePastAppointments = (
  mssql,
  moment,
  rsRepository,
  notificationListener,
  notificationParser,
  eventstore,
  uuid,
  commands,
  riMoment
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

    const results = await mssql.query`select distinct(a.starttime), a.* from Appointment a 
      where convert(datetime, a.Date) > CONVERT(datetime, '2/1/2018') 
      and convert(datetime, a.Date) < GETDATE()
    `;

    const clientHash = {};
    const trainerHash = {};
    const trainerColorHash = {};
    const locationHash = {};

    rsRepository = await rsRepository;
    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));
    trainers.forEach(x => (trainerColorHash[x.legacyId] = x.color));
    const locations = await rsRepository.query('select * from location');
    locations.forEach(x => (locationHash[x.legacyId] = x.locationId));
    const clientAppointmentsRecords = await mssql.query`select * from Appointment_Client`;
    const clientAppointments = clientAppointmentsRecords.recordset;
    const lastId = results.recordset[results.recordset.length - 1].EntityId;

    for (let x of results.recordset) {
      const appointmentType =
        x.AppointmentType === 'Hour'
          ? 'fullHour'
          : x.AppointmentType === 'Half Hour'
            ? 'halfHour'
            : x.AppointmentType === 'Pair'
              ? 'pair'
              : '';
      if (appointmentType) {
        const cmd = {
          commandName: 'scheduleAppointmentInPast',
          locationId: locationHash[x.LocationId],
          appointmentType,
          appointmentDate: x.Date,
          startTime: x.StartTime,
          endTime: x.EndTime,
          trainerId: trainerHash[x.TrainerId],
          notes: x.Notes,
          entityName: moment(x.Date).format('YYYYMMDD'),
          color: trainerColorHash[x.TrainerId],
          createdDate: x.CreatedDate,
          createdById: x.CreatedById,
          migration: true,
        };
        const clientForThisAppointmnet = clientAppointments.filter(
          ca => ca.AppointmentId === x.EntityId,
        );
        cmd.clients = clientForThisAppointmnet.map(
          ca => clientHash[ca.ClientId],
        );
        // fix for half hour pairs
        if (
          appointmentType === 'pair' &&
          clientForThisAppointmnet.some(c =>
            halfHourPairClients.includes(c.ClientId),
          )
        ) {
          cmd.appointmentType = 'halfHourPair';
          cmd.endTime = riMoment(cmd.endTime).subtract(30, 'minute');
        }

        const command = commands.scheduleAppointmentFactory(cmd);

        try {
          let continuationId = uuid.v4();
          let notificationPromise;
          if (x.EntityId === lastId) {
            notificationPromise = await notificationListener(continuationId);
          }


          await eventstore.commandPoster(
            command,
            'scheduleAppointmentInPast',
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
    }

    console.log(`==========rows==========`);
    console.log(results.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = migratePastAppointments;
