module.exports = function(rsRepository, eventstore, moment, uuid, logger) {
  let appointmentStatusUpdate = async function(ctx) {
    logger.debug('arrived at scheduledJobs.appointmentStatusUpdate');

    let date = moment().format('YYYY-MM-DD');
    let sql = `select * from appointment where date='${date}';`;
    const appointments = await rsRepository.query(sql);

    logger.info(`appoinments: ${JSON.stringify(appointments)}`);
    let commands = [];

    appointments.filter(x => {
      const before = moment(x.endTime).isBefore(moment(), 'minute');
      const notCompleted = !x.completed;
      return before && notCompleted;
    }).forEach(x =>
      x.clients.forEach(y => commands.push({
        commandName: 'clientAttendsAppointment',
        clientId: y,
        appointmentId: x.id,
        appointmentType: x.appointmentType
      }))
    );

    logger.info(`commands ${JSON.stringify(commands)}`);
    for (let c of commands) {
      await eventstore.commandPoster(c, c.commandName, uuid.v4());
    }

    ctx.status = 200;
    ctx.body = {commandsProcessed: commands};
  };

  return {
    appointmentStatusUpdate
  };
};
