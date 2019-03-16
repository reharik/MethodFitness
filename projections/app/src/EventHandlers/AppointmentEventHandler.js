module.exports = function(rsRepository, metaLogger, logger) {
  return async function appointmentsEventHandler() {
    logger.info('AppointmentEventHandler started up');

    async function appointmentScheduledInPast(event) {
      return await appointmentScheduled(event);
    }

    async function appointmentScheduled(event) {
      rsRepository = await rsRepository;
      const clients = event.clients.map(client => {
        return {
          clientId: client.clientId,
          clientName: `${client.lastName}, ${client.firstName}`,
        };
      });
      const appointment = Object.assign({}, event, {
        clients,
        trainerName: `${event.trainerLastName}, ${event.trainerFirstName}`,
      });

      return await saveAppointment(appointment);
    }

    async function appointmentCanceled(event) {
      rsRepository = await rsRepository;
      try {
        let sql = `DELETE FROM "appointment" where "id" = '${
          event.appointmentId
        }'`;
        return await rsRepository.saveQuery(sql);
      } catch (err) {
        logger.error(
          `error in deleteAppointment appointmentId: ${event.appointmentId}`,
        );
        logger.error(err);
      }
      return undefined;
    }

    async function pastAppointmentRemoved(event) {
      if (event.rescheduled) {
        return null;
      }
      return await appointmentCanceled(event);
    }

    async function pastAppointmentUpdated(event) {
      return await appointmentUpdated(event);
    }

    async function appointmentUpdated(event) {
      rsRepository = await rsRepository;
      const appointment = await rsRepository.getById(
        event.appointmentId,
        'appointment',
      );
      const clients = event.clients.map(client => {
        return {
          clientId: client.clientId,
          clientName: `${client.lastName}, ${client.firstName}`,
        };
      });
      const updatedAppointment = Object.assign({}, appointment, {
        appointmentType: event.appointmentType,
        enttityName: event.enttityName,
        date: event.date,
        startTime: event.startTime,
        endTime: event.endTime,
        trainerId: event.trainerId,
        clients,
        notes: event.notes,
        // completed,
        // sessionId: completed ? event.SessionId : undefined,
        sessionId: event.SessionId,
        locationId: event.locationId,
        location: event.locationName,
        trainerName: `${event.trainerLastName}, ${event.trainerFirstName}`,
      });
      return await saveAppointment(updatedAppointment);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await fundedAppointmentAttendedByClient(event);
    }

    async function fundedAppointmentAttendedByClient(event) {
      rsRepository = await rsRepository;
      let appointment = await rsRepository.getById(
        event.appointmentId,
        'appointment',
      );
      const updatedAppointment = Object.assign({}, appointment, {
        completed: true,
        sessionId: event.SessionId,
      });

      return await saveAppointment(updatedAppointment);
    }
    //
    // async function trainerPaid(event) {
    //   const appointments = state.trainerPaid(event);
    //
    //   // this looks bad because it doesn't wait for any of the responses,
    //   // but I don't need em so it's actually better.  Unless it throws, which could be bad
    //   appointments.forEach(async appointment => {
    //     await persistence.saveAppointmentOnly(appointment);
    //   });
    // }

    // I'm not doing client info change because the occurance of client name change
    // is pretty rare and the effect very limited plus it's much more difficult
    async function trainerInfoUpdated(event) {
      rsRepository = await rsRepository;
      let selectSql = `select * FROM "appointment" where document->>'trainerId' = '${
        event.trainerId
      }'`;
      let appointments = await rsRepository.query(selectSql);
      const updatedAppointments = appointments.map(appointment =>
        Object.extend({}, appointment, { color: event.color }),
      );

      updatedAppointments.forEach(async appointment => {
        await saveAppointment(appointment);
      });
    }

    async function locationUpdated(event) {
      rsRepository = await rsRepository;

      let selectSql = `select * FROM "appointment" where document->>'locationId' = '${
        event.locationId
      }'`;
      let appointments = await rsRepository.query(selectSql);
      const updatedAppointments = appointments.map(appointment =>
        Object.extend({}, appointment, { location: event.name }),
      );

      updatedAppointments.forEach(async appointment => {
        await saveAppointment(appointment);
      });
    }

    async function saveAppointment(appointment) {
      const query = `INSERT INTO "appointment" (
            "id",
            "date",
            "trainer",
            "document"
          ) 
          SELECT 
          '${appointment.appointmentId}',
          '${appointment.entityName}',
            '${appointment.trainerId}',
          '${rsRepository.sanitizeDocument(appointment)}'
        ON CONFLICT (id)
        DO UPDATE SET
            "date" = '${appointment.entityName}',
            "trainer" = '${appointment.trainerId}',
            "document" = '${rsRepository.sanitizeDocument(appointment)}';`;

      return await rsRepository.saveQuery(query);
    }

    return metaLogger(
      {
        handlerName: 'AppointmentEventHandler',
        appointmentScheduled,
        appointmentUpdated,
        appointmentCanceled,
        fundedAppointmentAttendedByClient,
        unfundedAppointmentAttendedByClient,
        appointmentScheduledInPast,
        pastAppointmentRemoved,
        pastAppointmentUpdated,
        // trainerPaid,
        trainerInfoUpdated,
        locationUpdated,
      },
      'AppointmentEventHandler',
    );
  };
};
