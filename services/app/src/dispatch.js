module.exports = function(rsRepository, eventstore, moment, uuid, logger) {
  return async () => {
    let date = moment().format('YYYY-MM-DD');
    let sql = `select * from appointment where date='${date}';`;
    const appointments = await rsRepository.query(sql);
    logger.info(JSON.stringify(appointments));
    let commands = [];

    appointments.filter(x => {
      const before = moment(x.endTime).isBefore(moment(), 'minute');
      const notCompleted = !x.completed;
      return before && notCompleted;
    })
      .map(x => ({clients: x.clients, appointmentId: x.id}))
      .forEach(x =>
        x.clients.forEach(y => commands.push({
          commandName: 'clientAttendsAppointment',
          id: y,
          appointmentId: x.appointmentId
        }))
      );
    logger.info(JSON.stringify(commands));
    for (let c of commands) {
      await eventstore.commandPoster(c, c.commandName, uuid.v4());
    }
  };
};
