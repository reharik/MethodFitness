module.exports = function(uuid, moment, invariant, loadTrainers, loadClients) {
  const seed = moment(moment().weekday(-1 * moment().day()).format('YYYYMMDD'));
  const seed2 = moment(moment().format('YYYYMMDD'));

  const trainer0 = loadTrainers.trainers[0];
  return {
    appointments: [
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[0].clientId],
        date: seed.toISOString(),
        startTime: moment(seed).hour('9').minute('00').format(),
        endTime: moment(seed).hour('9').minute('30').format(),
        entityName: seed.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: trainer0.trainerId,
        color: trainer0.color
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[2].clientId],
        date: seed.toISOString(),
        startTime: moment(seed).hour('7').minute('00').format(),
        endTime: moment(seed).hour('7').minute('30').format(),
        entityName: seed.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: trainer0.trainerId,
        color: trainer0.color
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[1].clientId],
        date: seed.toISOString(),
        startTime: moment(seed).hour('8').minute('00').format(),
        endTime: moment(seed).hour('8').minute('30').format(),
        entityName: seed.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: trainer0.trainerId,
        color: trainer0.color
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[0].clientId],
        date: seed2.toISOString(),
        startTime: moment(seed2).hour('9').minute('00').format(),
        endTime: moment(seed2).hour('9').minute('30').format(),
        entityName: seed2.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: trainer0.trainerId,
        color: trainer0.color
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[2].clientId],
        date: seed2.toISOString(),
        startTime: moment(seed2).hour('7').minute('00').format(),
        endTime: moment(seed2).hour('7').minute('30').format(),
        entityName: seed2.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: trainer0.trainerId,
        color: trainer0.color
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[1].clientId],
        date: seed2.toISOString(),
        startTime: moment(seed2).hour('8').minute('00').format(),
        endTime: moment(seed2).hour('8').minute('30').format(),
        entityName: seed2.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: trainer0.trainerId,
        color: trainer0.color
      }],

    scheduleAppointment: ({commandName,
                            appointmentType,
                            date,
                            startTime,
                            endTime,
                            trainerId,
                            clients,
                            notes,
                            entityName
                          }) => {
      invariant(appointmentType, `scheduleAppointment requires that you pass the appointmentType`);
      invariant(trainerId, `scheduleAppointment requires that you pass trainer`);
      invariant(date, `scheduleAppointment requires that you pass the appointment date`);
      invariant(startTime, `scheduleAppointment requires that you pass the appointment start time`);
      invariant(endTime, `scheduleAppointment requires that you pass the trainer`);
      invariant(clients && clients.length > 0, `scheduleAppointment requires that you pass at lease 1 client`);
      invariant(
        entityName,
        `scheduleAppointment requires that you pass the 
      enitityName since it's a date but the date prop is utc`
      );
      return {
        commandName,
        appointmentType,
        date,
        startTime,
        endTime,
        trainerId,
        clients,
        notes,
        entityName
      };
    }
  };
};
