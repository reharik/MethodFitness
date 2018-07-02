module.exports = function(rsRepository, unpaidAppointmentsState, logger) {
  return function() {
    async function initializeState(initialState) {
      logger.info('Initializing state in unpaidAppointmentsPersistence');
      let state = await rsRepository.getAggregateViewMeta(
        'unpaidAppointments',
        '00000000-0000-0000-0000-000000000001',
      );

      if (!state.trainers) {
        state = initialState;

        await rsRepository.insertAggregateMeta('unpaidAppointments', state);
      }
      return unpaidAppointmentsState(state);
    }

    const buildUnpaidAppointments = (state, id) => {
      let document = {};
      document.unpaidAppointments = state.innerState.unpaidAppointments
        .concat(state.innerState.unfundedAppointments)
        .filter(x => x.trainerId === id);
      document.trainerId = id;
      return document;
    };

    async function saveTrainer(state, id) {
      console.log(`=========="here"=========`);
      console.log('here'); // eslint-disable-line quotes
      console.log(`==========END "here"=========`);
      let document = buildUnpaidAppointments(state, id);
      console.log(`==========document=========`);
      console.log(document); // eslint-disable-line quotes
      console.log(`==========END document=========`);
      const sql = `UPDATE "unpaidAppointments" SET document = '${rsRepository.sanitizeDocument(
        document,
      )}' 
            where id = '${document.trainerId}';
        INSERT INTO "unpaidAppointments"
        ("id", "document") SELECT '${
          document.trainerId
        }','${rsRepository.sanitizeDocument(document)}'
        WHERE NOT EXISTS (SELECT 1 FROM "unpaidAppointments" WHERE id = '${
          document.trainerId
        }');`;
      console.log(`==========sql=========`);
      console.log(sql); // eslint-disable-line quotes
      console.log(`==========END sql=========`);
      await rsRepository.query(sql);
    }

    async function saveState(state, trainerId) {
      logger.info('Saving state in unpaidAppointmentsPersistence');
      let unpaidAppointments = {};
      // have to find out why this is not working
      if (trainerId) {
        unpaidAppointments.unpaidAppointments = state.innerState.unpaidAppointments
          .concat(state.innerState.unfundedAppointments)
          .filter(x => x.trainerId === trainerId);
        unpaidAppointments.trainerId = trainerId;
      }
      return await rsRepository.saveAggregateView(
        'unpaidAppointments',
        state.innerState,
        unpaidAppointments,
        'trainerId',
      );
    }

    return {
      initializeState,
      saveState,
      saveTrainer,
    };
  };
};
