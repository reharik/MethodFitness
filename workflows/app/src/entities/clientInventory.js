module.exports = function(sortby, metaLogger, logger) {
  return () => {
    let sessions = [];
    let consumedSessions = [];

    const addSessionsToInventory = event => {
      sessions = sessions.concat(event.sessions.filter(x => !x.used));
      consumedSessions = consumedSessions.concat(
        event.sessions.filter(x => x.used),
      );
    };

    const consumeSession = cmd => {
      //TODO remove after migration
      if (cmd.migration) {
        const sess = sessions.find(x => x.legacyAppointmentId === cmd.legacyId);
        if(!sess) {
          console.log(`==========cmd==========`);
          console.log(cmd);
          console.log(`==========END cmd==========`);
          console.log(`==========sessions==========`);
          console.log(sessions);
          console.log(consumedSessions);
          console.log(`==========END sessions==========`);
          return sess;
        }
      }

      return sessions
        .filter(x => x.appointmentType === cmd.appointmentType)
        .sort(sortby('createdDate'))[0];
    };

    const getUsedSessionByAppointmentId = appointmentId => {
      return consumedSessions.find(x => x.appointmentId === appointmentId);
    };

    const modifyConsumedSession = event => {
      consumedSessions.map(
        x =>
          x.sessionId === event.sessionId
            ? Object.assign({}, x, { appointmentId: event.appointmentId })
            : x,
      );
    };

    const replaceSession = event => {
      const idx = consumedSessions.findIndex(
        x => x.sessionId === event.sessionId,
      );
      const session = Object.assign({}, consumedSessions[idx]);
      logger.debug(
        `moving session from consumedSessions back into sessions. ${session}`,
      );
      delete session.used;
      delete session.appointmentId;
      sessions.push(session);
      consumedSessions.splice(idx, 1);
    };

    const sessionConsumed = (
      sessionId,
      appointmentId,
      trainerPay,
      trainerPercentage,
      trainerId,
    ) => {
      if (appointmentId) {
        let session = sessions.find(x => x.sessionId === sessionId);
        logger.debug(
          `addding session to consumedSession with appointmentId: ${appointmentId} in clientInventory`,
        );
        consumedSessions.push(
          Object.assign({}, session, {
            appointmentId,
            trainerPay,
            trainerPercentage,
            trainerId,
          }),
        );
      }
      logger.debug(
        `removing session ${sessionId} from sessions in clientInventory`,
      );
      sessions = sessions.filter(x => x.sessionId !== sessionId);
    };

    const sessionsExists = cmd => {
      return cmd.refundSessions.every(x =>
        sessions.some(y => y.sessionId === x.sessionId),
      );
    };

    const getDamnSessions = () => {
      return consumedSessions;
    };

    return metaLogger({
      getDamnSessions,
      addSessionsToInventory,
      consumeSession,
      getUsedSessionByAppointmentId,
      modifyConsumedSession,
      replaceSession,
      sessionConsumed,
      sessionsExists,
    });
  };
};
