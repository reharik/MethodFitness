const migratePastAppointments = (
  mssql,
  moment,
  rsRepository,
  eventstore,
  uuid,
  commands,
) => {
  return async () => {
    mssql = await mssql;

    const results = await mssql.query`select a.* 
      from [Session] s inner join Appointment a on s.AppointmentId = a.EntityId 
      where convert(datetime, s.ChangedDate) > CONVERT(datetime, '2/1/2018')
    `;

    const clientHash = {};
    const trainerHash = {};
    const trainerColorHash = {};

    rsRepository = await rsRepository;
    const clients = await rsRepository.query('select * from client');
    clients.forEach(x => (clientHash[x.legacyId] = x.clientId));
    const trainers = await rsRepository.query('select * from trainer');
    trainers.forEach(x => (trainerHash[x.legacyId] = x.trainerId));
    trainers.forEach(x => (trainerColorHash[x.legacyId] = x.color));
    const clientAppointments = await mssql.query`select * from Appointment_Client`;

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
          appointmentType,
          date: x.Date,
          startTime: x.StartTime,
          endTime: x.EndTime,
          trainerId: trainerHash[x.TrainerId],
          notes: x.notes,
          entityName: moment(x.Date).format('YYYYMMDD'),
          color: trainerColorHash[x.TrainerId],
          createdDate: x.createdDate,
          createdById: x.createdById,
          migration: true,
        };
        cmd.clients = clientAppointments.recordset
          .filter(ca => ca.AppointmentId === x.EntityId)
          .map(ca => clientHash[ca.ClientId]);

        const command = commands.scheduleAppointmentFactory(cmd);

        try {
          await eventstore.commandPoster(
            command,
            'scheduleAppointmentInPast',
            uuid.v4(),
          );
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
