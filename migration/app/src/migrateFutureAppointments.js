const migrateFutureAppointments = (
  mssql,
  moment,
  rsRepository,
  eventstore,
  uuid,
  R,
  commands,
) => {
  return async () => {
    mssql = await mssql;

    const results = await mssql.query`select * 
    from appointment
    where convert(datetime, Date) > GETDATE() AND convert(datetime, Date) < ${moment()
      .add(1, 'year')
      .toISOString()} `;

    const clientHash = {};
    const trainerHash = {};
    const trainerColorHash = {};

    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));
    trainers.forEach(x => (trainerColorHash[x.legacyId] = x.color));
    const clientAppointments = await mssql.query`select * from Appointment_Client`;

    for (let x of R.sortBy(f => f.StartTime, results.recordset)) {
      const appointmentType =
        x.AppointmentType === 'Hour'
          ? 'fullHour'
          : x.AppointmentType === 'Half Hour'
            ? 'halfHour'
            : x.AppointmentType === 'Pair'
              ? 'pair'
              : '';

      // console.log(`==========moment(x.StartTime).toSTring()==========`);
      // console.log(x.StartTime);
      // console.log(moment(x.StartTime).toISOString());
      // console.log(moment.utc(x.StartTime).toISOString());
      // console.log(
      //   moment(x.StartTime)
      //     .add(5, 'hour')
      //     .toISOString(),
      // );
      // console.log(`==========END moment(x.StartTime).toSTring()==========`);

      if (appointmentType) {
        const cmd = {
          commandName: 'scheduleAppointment',
          appointmentType,
          date: moment(x.Date)
            .add(12, 'hour')
            .toISOString(),

          startTime: moment(x.StartTime)
            .add(5, 'hour')
            .toISOString(),
          endTime: moment(x.EndTime)
            .add(5, 'hour')
            .toISOString(),
          trainerId: trainerHash[x.TrainerId],
          notes: x.notes,
          entityName: moment
            .utc(x.Date)
            .add(12, 'hour')
            .format('YYYYMMDD'),
          color: trainerColorHash[x.TrainerId],
        };
        cmd.clients = clientAppointments.recordset
          .filter(ca => ca.AppointmentId === x.EntityId)
          .map(ca => clientHash[ca.ClientId]);

        const command = commands.scheduleAppointmentFactory(cmd);
        try {
          await eventstore.commandPoster(
            command,
            'scheduleAppointment',
            uuid.v4(),
          );
        } catch (ex) {
          console.log(`==========ex==========`);
          console.log(ex);
          console.log(`==========END ex==========`);
        }
      }
    }

    // }
    console.log(`==========rows==========`);
    console.log(results.rowsAffected);
    console.log(`==========END rows==========`);
  };
};

module.exports = migrateFutureAppointments;
//TODO then we'll need to query for sessions in arrears and create those appointments in past;
