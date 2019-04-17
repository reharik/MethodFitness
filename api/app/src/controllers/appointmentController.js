module.exports = function(
  rsRepository,
  eventstore,
  notificationListener,
  notificationParser,
  commands,
  moment,
  logger,
  uuid,
  R,
  reseedDB,
) {
  let fetchAppointment = async function(ctx) {
    logger.debug('arrived at appointment.fetchAppointment');
    rsRepository = await rsRepository;
    const appointments = await rsRepository.getById(
      ctx.params.appointmentId,
      'appointment',
    );
    ctx.status = 200;
    ctx.body = appointments;
  };

  let fetchAppointments = async function(ctx) {
    logger.debug('arrived at appointment.fetchAppointments');
    rsRepository = await rsRepository;
    const trainerClause = ` AND "trainer" = '${ctx.state.user.trainerId}'`;
    const sql = `SELECT * from "appointment" 
      where  "date" >= '${ctx.params.startDate}' 
        AND "date" <= '${ctx.params.endDate}'
        ${ctx.state.user.role !== 'admin' ? trainerClause : ''}`;
    const appointments = await rsRepository.query(sql);
    ctx.status = 200;
    ctx.body = { appointments };
  };

  let scheduleAppointment = async function(ctx) {
    console.log(`==========ctx.request.body=========`);
    console.log(ctx.request.body);
    console.log(`==========END ctx.request.body=========`);

    logger.debug('arrived at appointment.scheduleAppointment');
    let payload = ctx.request.body;
    payload.commandName = 'scheduleAppointment';
    const notification = await processMessage(
      payload,
      'scheduleAppointmentFactory',
      'scheduleAppointment',
    );
    const result = await notificationParser(notification);

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let scheduleAppointmentInPast = async function(ctx) {
    logger.debug('arrived at appointment.scheduleAppointmentInPast');
    let payload = ctx.request.body;
    payload.commandName = 'scheduleAppointmentInPast';
    const notification = await processMessage(
      payload,
      'scheduleAppointmentFactory',
      'scheduleAppointmentInPast',
    );
    const result = await notificationParser(notification);

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let updateAppointment = async function(ctx) {
    try {
      logger.debug('arrived at appointment.updateAppointment');
      rsRepository = await rsRepository;
      let body = ctx.request.body;
      let notification;
      let commandName = '';
      const appointment = await rsRepository.getById(
        body.appointmentId,
        'appointment',
      );
      let clientsSame =
        R.symmetricDifference(body.clients, appointment.clients).length <= 0;
      if (
        moment(appointment.appointmentDate).format('YYYYMMDD') !==
          moment(body.appointmentDate).format('YYYYMMDD') ||
        !moment(appointment.startTime).isSame(moment(body.startTime))
      ) {
        commandName += 'rescheduleAppointment';
        body.originalEntityName = appointment.entityName;
      } else if (
        appointment.appointmentType !== body.appointmentType ||
        !clientsSame ||
        appointment.trainerId !== body.trainerId ||
        appointment.notes !== body.notes ||
        appointment.locationId !== body.locationId
      ) {
        commandName += 'updateAppointment';
      } else {
        throw new Error(
          'UpdateAppointment called but no change in appointment',
        );
      }
      body.commandName = commandName;
      notification = await processMessage(
        body,
        'scheduleAppointmentFactory',
        commandName,
      );
      const result = await notificationParser(notification);

      ctx.body = result.body;
      ctx.status = result.status;
    } catch (ex) {
      throw ex;
    }
  };

  let getWhatChangedOnAppointment = (orig, update, clientSame) => {
    let changes = {};
    if (orig.appointmentType !== update.appointmentType) {
      changes.appointmentType = true;
    }
    if (!clientSame) {
      changes.clients = true;
    }
    if (orig.trainerId !== update.trainerId) {
      changes.trainer = true;
    }
    if (orig.date !== update.date) {
      changes.date = true;
    }
    return changes;
  };

  let updateAppointmentFromPast = async function(ctx) {
    rsRepository = await rsRepository;
    try {
      logger.debug('arrived at appointment.updateAppointmentFromPast');
      let body = ctx.request.body;
      let notification;
      const appointment = await rsRepository.getById(
        body.appointmentId,
        'appointment',
      );

      let clientsSame =
        R.symmetricDifference(
          body.clients,
          appointment.clients.map(x => x.clientId),
        ).length <= 0;

      if (
        moment(appointment.appointmentDate).format('YYYYMMDD') ===
          moment(body.appointmentDate).format('YYYYMMDD') &&
        moment(appointment.startTime).isSame(moment(body.startTime)) &&
        appointment.appointmentType === body.appointmentType &&
        clientsSame &&
        appointment.trainerId === body.trainerId &&
        appointment.notes === body.notes &&
        appointment.locationId === body.locationId
      ) {
        throw new Error(
          'UpdateAppointmentFromPast called but no change in appointment',
        );
      }
      body.commandName = 'updateAppointmentFromPast';
      body.originalEntityName = appointment.entityName;
      body.changes = getWhatChangedOnAppointment(
        appointment,
        body,
        clientsSame,
      );

      notification = await processMessage(
        body,
        'scheduleAppointmentFactory',
        'updateAppointmentFromPast',
      );
      const result = await notificationParser(notification);
      ctx.body = result.body;
      ctx.status = result.status;
    } catch (ex) {
      throw ex;
    }
  };

  let cancelAppointment = async function(ctx) {
    logger.debug('arrived at appointment.cancelAppointment');
    let body = ctx.request.body;

    const notification = await processCommandMessage(body, 'cancelAppointment');
    const result = await notificationParser(notification);

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let removeAppointmentFromPast = async function(ctx) {
    logger.debug('arrived at appointment.removeAppointmentFromPast');
    let body = ctx.request.body;
    body.commandName = 'removeAppointmentFromPast';
    const notification = await processCommandMessage(
      body,
      'removeAppointmentFromPast',
    );
    const result = await notificationParser(notification);

    ctx.body = result.body;
    ctx.status = result.status;
  };

  let processCommandMessage = async function(payload, commandName) {
    return await processMessage(payload, commandName + 'Command', commandName);
  };

  let processMessage = async function(payload, commandFactory, commandName) {
    logger.debug(`api: processing ${commandName}`);
    const continuationId = uuid.v4();
    let notificationPromise = await notificationListener(continuationId);
    const command = commands[commandFactory](payload);
    await eventstore.commandPoster(command, commandName, continuationId);
    return notificationPromise;
  };

  let cleanAllTestData = async function(ctx) {
    await reseedDB.exec();
    // const appointments = await rsRepository.query('select * from appointment');
    // const sessionsPurchasedMeta = await rsRepository.saveQuery(
    //   'select meta from "sessionsPurchased"',
    // );
    // const sessions = sessionsPurchasedMeta.rows.find(x => x.meta).meta.sessions;
    // const sessionsPerClient = sessions.reduce((a, b) => {
    //   if (a[b.clientId]) {
    //     a[b.clientId].push(b);
    //   } else {
    //     a[b.clientId] = [b];
    //   }
    //   return a;
    // }, {});
    // for (const x of appointments) {
    //   if (!Array.isArray(x)) {
    //     let payload = {
    //       appointmentId: x.appointmentId,
    //       clients: x.clients,
    //       entityName: moment(x.date).format('YYYYMMDD'),
    //     };
    //     if (x.completed) {
    //       await processMessage(
    //         payload,
    //         'removeAppointmentFromPastCommand',
    //         'removeAppointmentFromPast',
    //       );
    //     } else {
    //       await processMessage(
    //         payload,
    //         'cancelAppointmentCommand',
    //         'cancelAppointment',
    //       );
    //     }
    //   }
    // }
    //
    // for (const clientId of Object.keys(sessionsPerClient)) {
    //   await processMessage(
    //     {
    //       clientId,
    //       refundSessions: sessionsPerClient[clientId]
    //         .filter(x => !x.refunded && !x.used)
    //         .map(x => ({
    //           sessionId: x.sessionId,
    //           appointmentType: x.appointmentType,
    //         })),
    //     },
    //     'refundSessionsCommand',
    //     'refundSessions',
    //   );
    // }
    ctx.status = 200;
    return ctx;
  };

  return {
    scheduleAppointment,
    updateAppointment,
    cancelAppointment,
    fetchAppointment,
    fetchAppointments,
    scheduleAppointmentInPast,
    removeAppointmentFromPast,
    updateAppointmentFromPast,
    cleanAllTestData,
  };
};
