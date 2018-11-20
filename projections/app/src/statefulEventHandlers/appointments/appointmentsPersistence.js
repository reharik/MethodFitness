module.exports = function(rsRepository, appointmentsState, logger) {
  return function() {
    async function initializeState(initialState) {
      rsRepository = await rsRepository;
      logger.info('Initializing state in appointmentsPersistence');

      let state = await rsRepository.getAggregateViewMeta(
        'appointment',
        '00000000-0000-0000-0000-000000000001',
      );

      if (!state.trainers) {
        state = initialState;

        let query = `INSERT INTO "appointment" 
          ("id","trainer", "date", "meta") 
          VALUES 
          (
            '00000000-0000-0000-0000-000000000001',
            '00000000-0000-0000-0000-000000000001',
            NOW(),
            '${rsRepository.sanitizeDocument(state)}'
          )`;
        await rsRepository.saveQuery(query);
      }
      return appointmentsState(state);
    }

    async function saveAppointmentOnly(appointment) {
      logger.info('Saving appointment in saveAppointmentOnly');
      rsRepository = await rsRepository;
      try {
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
      } catch (err) {
        logger.error(`error in saveAppointmentOnly
 document: ${rsRepository.sanitizeDocument(appointment)},
 table: appointment`);
        logger.error(err);
      }
      return undefined;
    }

    async function saveState(state, appointment) {
      logger.info('Saving state in appointmentsPersistence');
      rsRepository = await rsRepository;
      try {
        let query;
        if (appointment && appointment.appointmentId) {
          query = `INSERT INTO "appointment" (
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
        }

        let updateAggSql = `UPDATE "appointment" SET meta = '${rsRepository.sanitizeDocument(
          state.innerState,
        )}'
            where id = '${state.innerState.id}'`;
        let sql = `${query || ''}${updateAggSql}`;
        return await rsRepository.saveQuery(sql);
      } catch (err) {
        logger.error(`error in saveAggregateView
 aggregate: ${rsRepository.sanitizeDocument(state.innerState)},
 document: ${rsRepository.sanitizeDocument(appointment)},
 table: appointment`);
        logger.error(err);
      }
      return undefined;
    }

    async function deleteAppointment(id) {
      rsRepository = await rsRepository;
      try {
        let sql = `DELETE FROM "appointment" where "id" = '${id}'`;
        return await rsRepository.saveQuery(sql);
      } catch (err) {
        logger.error(`error in deleteAppointment appointmentId: ${id}`);
        logger.error(err);
      }
      return undefined;
    }

    return {
      initializeState,
      saveState,
      deleteAppointment,
      saveAppointmentOnly,
    };
  };
};
