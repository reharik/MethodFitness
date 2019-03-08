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
    rsRepository = await rsRepository;
    let date = moment().format('YYYY-MM-DD');
    let sql = `select * from appointment 
    where date<='${date}' and date>'${moment()
      .subtract(6, 'month')
      .format('YYYY-MM-DD')}';`;
    const appointments = await rsRepository.query(sql);

    logger.info(`appoinments: ${JSON.stringify(appointments, null, 4)}`);
    let _commands = [];
    const now = moment();
    logger.trace(`now: ${now.toString()}`);
    appointments
      .filter(x => {
        const endTime = moment(x.endTime);
        logger.trace(`appt endTime: ${endTime.toString()}`);
        const before = endTime.isBefore(now, 'minute');
        const notCompleted = !x.completed;
        return before && notCompleted;
      })
      .forEach(x =>
        x.clients.forEach(y =>
          _commands.push(
            commands.clientAttendsAppointmentCommand({
              clientId: y.clientId,
              trainerId: x.trainerId,
              appointmentId: x.appointmentId,
              appointmentType: x.appointmentType,
              startTime: x.startTime,
              date: x.date
            }),
          ),
        ),
      );

    logger.info(`commands ${JSON.stringify(_commands, null, 4)}`);
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
