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
            '${event.id}',
            '${event.entityName}',
            '${event.trainerId}',
            '${JSON.stringify(event)}')`;
      return await rsRepository.saveQuery(sql);
    }

    async function appointmentMovedFromDifferentDay(event) {
      logger.info('handling appointmentMovedFromDifferentDay event');
      let sql = `INSERT INTO "appointment" (
            "id", 
            "date",
            "trainer",
            "document"
            ) VALUES (
            '${event.id}',
            '${event.entityName}',
            '${event.trainerId}',
            '${JSON.stringify(event)}')`;
      return await rsRepository.saveQuery(sql);
    }

    async function appointmentCanceled(event) {
      logger.info('handling appointmentCanceled event');

      let sql = `DELETE FROM "appointment" where "id" = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function appointmentRescheduled(event) {
      logger.info('handling appointmentRescheduled event');
      return appointmentUpdated(event);
    }

    async function appointmentUpdated(event) {
      let sql = `update "appointment" set
            "date" = '${event.entityName}',
            "trainer" = '${event.trainerId}',
            "document" = '${JSON.stringify(event)}'
            where "id" = '${event.id}'`;
      return await rsRepository.saveQuery(sql);
    }

    async function appointmentAttendedByClient(event) {
      let appointment = await rsRepository.getById(event.appointmentId, 'appointment');
      appointment.completed = true;
      return await rsRepository.save('appointment', appointment, event.appointmentId);
    }

    return {
      handlerName: 'AppointmentEventHandler',
      appointmentScheduled,
      appointmentMovedFromDifferentDay,
      appointmentCanceled,
      appointmentRescheduled,
      appointmentUpdated,
      appointmentAttendedByClient
    };
  };
};
