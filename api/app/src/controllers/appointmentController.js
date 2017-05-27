module.exports = function(
  rsRepository,
  eventstore,
  notificationListener,
  notificationParser,
  commands,
  moment,
  logger,
  uuid
) {
  let fetchAppointment = async function(ctx) {
    logger.debug('arrived at appointment.fetchAppointment');
    const appointments = await rsRepository.getById(ctx.params.id, 'appointment');
    ctx.status = 200;
    ctx.body = appointments;
  };

  let fetchAppointments = async function(ctx) {
    logger.debug('arrived at appointment.fetchAppointments');
    const sql = `SELECT * from "appointment" 
      where  "date" >= '${ctx.params.startDate}' 
        AND "date" <= '${ctx.params.endDate}'
        ${ctx.state.user.role !== 'admin' ? ` AND "trainer" = '${ctx.state.user.id}'` : ``}`;
    const appointments = await rsRepository.query(sql);
    ctx.status = 200;
    ctx.body = appointments;
  };

  let scheduleAppointment = async function(ctx) {
    logger.debug('arrived at appointment.scheduleAppointment');
    let payload = ctx.request.body;
    payload.commandName = 'scheduleAppointment';
    const notification = await processMessage(payload, 'scheduleAppointmentFactory', 'scheduleAppointment');
    const result = notificationParser(notification);

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateAppointment = async function(ctx) {
    try {
      logger.debug('arrived at appointment.updateAppointment');
      let body = ctx.request.body;
      let notification;
      let commandName = '';
      const appointment = await rsRepository.getById(body.id, 'appointment');
      let clientsSame = true;
      for (let i = 0; i < body.clients.length; i++) {
        if (body.clients[i] !== appointment.clients[i]) {
          clientsSame = false;
        }
      }
      if (
        moment(appointment.date).format('YYYYMMDD') !== moment(body.date).format('YYYYMMDD') ||
        !moment(appointment.startTime).isSame(moment(body.startTime))
      ) {
        commandName += 'rescheduleAppointment';
        body.originalEntityName = appointment.entityName;
      } else if (
        appointment.appointmentType !== body.appointmentType ||
        !clientsSame ||
        appointment.trainer !== body.trainer ||
        appointment.notes !== body.notes
      ) {
        commandName += 'updateAppointment';
      } else {
        throw new Error('UpdateAppointment called but no change in appointment');
      }
      body.commandName = commandName;
      body.appointmentId = body.id;

      notification = await processMessage(body, 'scheduleAppointmentFactory', commandName);

      const result = notificationParser(notification);

      ctx.body = result.body;
      ctx.status = result.status;
    } catch (ex) {
      ctx.body = { success: false, error: ex };
      ctx.status = 500;
    }
  };

  let cancelAppointment = async function(ctx) {
    logger.debug('arrived at appointment.cancelAppointment');
    let body = ctx.request.body;

    const notification = await processCommandMessage(body, 'cancelAppointment');
    const result = notificationParser(notification);

    ctx.body = result.body;
    ctx.status = result.status;
  };

  var processCommandMessage = async function(payload, commandName) {
    return await processMessage(payload, commandName + 'Command', commandName);
  };

  var processMessage = async function(payload, commandFactory, commandName) {
    logger.debug(`api: processing ${commandName}`);
    const continuationId = uuid.v4();
    let notificationPromise = notificationListener(continuationId);
    const command = commands[commandFactory](payload);
    await eventstore.commandPoster(command, commandName, continuationId);

    return await notificationPromise;
  };

  return {
    scheduleAppointment,
    updateAppointment,
    cancelAppointment,
    fetchAppointment,
    fetchAppointments
  };
};
