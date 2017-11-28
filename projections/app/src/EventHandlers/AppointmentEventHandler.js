module.exports = function(rsRepository, logger) {
  return function AppointmentEventHandler() {
    logger.info('AppointmentEventHandler started up');

    async function appointmentScheduledInPast(event) {
      logger.info('handling appointmentScheduledInPast event in AppointmentEventHandler');
      logger.info('passing appointmentScheduledInPast to appointmentScheduled');
      return await appointmentScheduled(event);
    }

    async function appointmentScheduled(event) {
      logger.info('handling appointmentScheduled event in AppointmentEventHandler');

      let sql = `INSERT INTO "appointment" (
            "id", 
            "date",
            "trainer",
            "document"
            ) VALUES (
            '${event.appointmentId}',
            '${event.entityName}',
            '${event.trainerId}',
            '${JSON.stringify(event)}')`;
      return await rsRepository.saveQuery(sql);
    }

    async function appointmentCanceled(event) {
      logger.info('handling appointmentCanceled event in AppointmentEventHandler');

      let sql = `DELETE FROM "appointment" where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function pastAppointmentRemoved(event) {
      logger.info('handling pastAppointmentRemoved event in AppointmentEventHandler');

      let sql = `DELETE FROM "appointment" where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function pastAppointmentUpdated(event) {
      logger.info('handling pastAppointmentUpdated event in AppointmentEventHandler');
      if (event.rescheduled) {
        logger.info('passing pastAppointmentUpdated to appointmentScheduled');
        return await appointmentScheduled(event);
      } else {
        logger.info('passing pastAppointmentUpdated to appointmentUpdated');
        return await appointmentUpdated(event);
      }
    }

    async function appointmentUpdated(event) {
      logger.info('handling appointmentUpdated event in AppointmentEventHandler');
      let sql = `update "appointment" set
            "date" = '${event.entityName}',
            "trainer" = '${event.trainerId}',
            "document" = '${JSON.stringify(event)}'
            where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      logger.info('handling unfundedAppointmentAttendedByClient event in AppointmentEventHandler');
      logger.info('passing unfundedAppointmentAttendedByClient to appointmentAttendedByClient');
      return await appointmentAttendedByClient(event);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event in AppointmentEventHandler');
      let appointment = await rsRepository.getById(event.appointmentId, 'appointment');
      appointment.completed = true;
      appointment.sessionId = event.sessionId;
      let sql = `update "appointment" set
            "date" = '${appointment.entityName}',
            "trainer" = '${appointment.trainerId}',
            "document" = '${JSON.stringify(appointment)}'
            where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function trainerPaid(event) {
      const appointmentIds = event.paidAppointments.map(x => `'${x.appointmentId}'`);
      let appointments = await rsRepository.getByIds(appointmentIds, 'appointment');
      const query = doc => {
        return `UPDATE SET document = '${rsRepository.sanitizeDocument(document)}'
        WHERE "id" = '${doc.appointmentId}'`;
      };
      // this looks bad because it doesn't wait for any of the responses,
      // but I don't need em so it's actually better.  Unless it throws, which could be bad
      appointments.forEach(async x => {
        x.paid = true;
        await rsRepository.query(query(x));
      });
    }

    async function trainerInfoUpdated(event) {
      logger.info('handling trainerInfoUpdated event in AppointmentEventHandler');
      let sql = `select * FROM "appointment" where "trainer" = '${event.trainerId}'`;
      let appointments = await rsRepository.query(sql);
      let updatedAppointments = appointments.map(x => Object.assign({}, x, { color: event.color }));
      for (let a of updatedAppointments) {
        let sql = `update "appointment" set
            "document" = '${JSON.stringify(a)}'
            where "id" = '${a.appointmentId}'`;
        await rsRepository.saveQuery(sql);
      }
    }

    return {
      handlerName: 'AppointmentEventHandler',
      appointmentScheduled,
      appointmentCanceled,
      appointmentUpdated,
      appointmentAttendedByClient,
      unfundedAppointmentAttendedByClient,
      appointmentScheduledInPast,
      pastAppointmentRemoved,
      pastAppointmentUpdated,
      trainerPaid,
      trainerInfoUpdated
    };
  };
};
