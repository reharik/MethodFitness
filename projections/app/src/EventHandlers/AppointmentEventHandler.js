module.exports = function(rsRepository, metaLogger, logger) {
  return function AppointmentEventHandler() {
    logger.info('AppointmentEventHandler started up');

    async function appointmentScheduledInPast(event) {
      return await appointmentScheduled(event);
    }

    async function appointmentScheduled(event) {
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
      let sql = `DELETE FROM "appointment" where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function pastAppointmentRemoved(event) {
      if (event.rescheduled) {
        return undefined;
      }
      let sql = `DELETE FROM "appointment" where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function pastAppointmentUpdated(event) {
      return await appointmentUpdated(event);
    }

    async function appointmentUpdated(event) {
      let appointment = await rsRepository.getById(event.appointmentId, 'appointment');
      let update = Object.assign(
        {},
        appointment,
        {
          appointmentType: event.appointmentType,
          date: event.date,
          startTime: event.startTime,
          endTime: event.endTime,
          trainerId: event.trainerId,
          clients: event.clients,
          notes: event.notes,
        }
      );
      let sql = `update "appointment" set
            "date" = '${event.entityName}',
            "trainer" = '${event.trainerId}',
            "document" = '${JSON.stringify(update)}'
            where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await fundedAppointmentAttendedByClient(event);
    }

    async function fundedAppointmentAttendedByClient(event) {
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
      const appointmentIds = event.paidAppointments.map(x => x.appointmentId);
      let appointments = await rsRepository.getByIds(appointmentIds, 'appointment');
      const query = doc => {
        return `UPDATE "appointment" SET document = '${rsRepository.sanitizeDocument(doc)}'
        WHERE "id" = '${doc.appointmentId}'`;
      };
      // this looks bad because it doesn't wait for any of the responses,
      // but I don't need em so it's actually better.  Unless it throws, which could be bad
      appointments = Array.isArray(appointments) ? appointments : [appointments];
      appointments.forEach(async x => {
        x.paid = true;
        await rsRepository.query(query(x));
      });
    }

    async function trainerInfoUpdated(event) {
      let selectSql = `select * FROM "appointment" where "trainer" = '${event.trainerId}'`;
      let appointments = await rsRepository.query(selectSql);
      let updatedAppointments = appointments.map(x => Object.assign({}, x, { color: event.color }));
      for (let a of updatedAppointments) {
        let updateSql = `update "appointment" set
            "document" = '${JSON.stringify(a)}'
            where "id" = '${a.appointmentId}'`;
        await rsRepository.saveQuery(updateSql);
      }
    }

    return metaLogger({
      handlerName: 'AppointmentEventHandler',
      appointmentScheduled,
      appointmentCanceled,
      appointmentUpdated,
      fundedAppointmentAttendedByClient,
      unfundedAppointmentAttendedByClient,
      appointmentScheduledInPast,
      pastAppointmentRemoved,
      pastAppointmentUpdated,
      trainerPaid,
      trainerInfoUpdated
    }, 'AppointmentEventHandler');
  };
};
