module.exports = function(uuid, moment, invariant, loadTrainers, loadClients) {
  const seed = moment();
  const getISODateTime = (date, time = '1:00') => {
    moment.locale('en');
    let hour = parseInt(time.substring(0, time.indexOf(':')));
    let min =  parseInt(time.substring(time.indexOf(':') + 1, time.indexOf(' ')));
    let A = time.substring(time.indexOf(' ') + 1);
    hour = A === 'AM' ? hour : hour + 12;
    const result = moment(seed);
    if (result.utcOffset() !== 300) {
      result.utcOffset(5);
    }
    result = result.hour(hour).minute(min);
    console.log(`==========result.utcOffset()=========`);
    console.log(result.utcOffset());
    console.log(`==========END result.utcOffset()=========`);

    console.log(`==========result=========`);
    console.log(result.toString());
    console.log(result.toISOString());
    console.log(`==========END result=========`);
    return result.toISOString();
  };

  return {
    appointments: [
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[0].id],
        date: seed.toISOString(),
        startTime: getISODateTime(seed, '9:00 AM'),
        endTime: getISODateTime(seed, '9:30 AM'),
        entityName: seed.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: loadTrainers.trainers[0].id,
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[2].id],
        date: seed.toISOString(),
        startTime: getISODateTime(seed, '7:00 AM'),
        endTime: getISODateTime(seed, '7:30 AM'),
        entityName: seed.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: loadTrainers.trainers[0].id,
      },
      {
        commandName: 'scheduleAppointment',
        appointmentType: 'halfHour',
        clients: [loadClients.clients[1].id],
        date: seed.toISOString(),
        startTime: getISODateTime(seed, '8:00 AM'),
        endTime: getISODateTime(seed, '8:30 AM'),
        entityName: seed.format('YYYYMMDD'),
        notes: 'hi mom',
        trainerId: loadTrainers.trainers[0].id,
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
