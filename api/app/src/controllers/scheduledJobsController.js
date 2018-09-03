module.exports = function(
  rsRepository,
  eventstore,
  moment,
  uuid,
  commands,
  logger,
) {
  let appointmentStatusUpdate = async function(ctx) {
    logger.debug('arrived at scheduledJobs.appointmentStatusUpdate');
    let date = moment().format('YYYY-MM-DD');
    let sql = `select * from appointment 
    where date<='${date}' and date>'${moment()
      .subtract(6, 'month')
      .format('YYYY-MM-DD')}';`;
    const appointments = await rsRepository.query(sql);
    console.log(`==========appointments==========`);
    console.log(appointments);
    console.log(`==========END appointments==========`);

    logger.info(`appoinments: ${JSON.stringify(appointments)}`);
    let _commands = [];

    appointments
      .filter(x => {
        const before = moment(x.endTime).isBefore(moment(), 'minute');
        const notCompleted = !x.completed;
        return before && notCompleted;
      })
      .forEach(x =>
        x.clients.forEach(y =>
          _commands.push(
            commands.clientAttendsAppointmentCommand({
              clientId: y,
              trainerId: x.trainerId,
              appointmentId: x.appointmentId,
              appointmentType: x.appointmentType,
            }),
          ),
        ),
      );

    logger.info(`commands ${JSON.stringify(_commands)}`);
    for (let c of _commands) {
      await eventstore.commandPoster(c, c.commandName, uuid.v4());
    }

    ctx.status = 200;
    ctx.body = { commandsProcessed: _commands };
  };

  return {
    appointmentStatusUpdate,
  };
};
