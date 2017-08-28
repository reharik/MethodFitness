module.exports = function(rsRepository, logger) {
  return function AppointmentEventHandler() {
    logger.info('AppointmentEventHandler started up');

    async function appointmentScheduled(event) {
      logger.info('handling appointmentScheduled event');

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
      logger.info('handling appointmentCanceled event');

      let sql = `DELETE FROM "appointment" where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function pastAppointmentRemoved(event) {
      logger.info('handling pastAppointmentRemoved event');

      let sql = `DELETE FROM "appointment" where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function appointmentUpdated(event) {
      let sql = `update "appointment" set
            "date" = '${event.entityName}',
            "trainer" = '${event.trainerId}',
            "document" = '${JSON.stringify(event)}'
            where "id" = '${event.appointmentId}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function unfundedAppointmentAttendedByClient(event) {
      return await appointmentAttendedByClient(event);
    }

    async function appointmentAttendedByClient(event) {
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

    return {
      handlerName: 'AppointmentEventHandler',
      appointmentScheduled,
      appointmentCanceled,
      appointmentUpdated,
      appointmentAttendedByClient,
      unfundedAppointmentAttendedByClient,
      pastAppointmentRemoved
    };
  };
};
