module.exports = function(sortby, logger) {
  return class ClientInventory {
    constructor() {
      this.sessions = [];
      this.consumedSessions = [];
    }

    addSessionsToInventory(event) {
      this.sessions = this.sessions.concat(event.sessions.filter(x => !x.used));
      this.consumedSessions = this.consumedSessions.concat(event.sessions.filter(x => x.used));
    }

    consumeSession(cmd) {
      return this.sessions
        .filter(x => x.appointmentType === cmd.appointmentType)
        .sort(sortby('createdDate'))[0];
    }

    removeSession(sessionId, appointmentId) {
      if (appointmentId) {
        let session = this.sessions.find(x => x.sessionId === sessionId);
        logger.debug(`addding session to consumedSession with appointmentId: ${appointmentId} in clientInventory`);
        this.consumedSessions.push(Object.assign({}, session, {appointmentId}));
      }
      logger.debug(`removing session from sessions in clientInventory`);
      this.sessions = this.sessions.filter(x => x.sessionId !== sessionId);
    }

    sessionsExists(cmd) {
      return !cmd.refundSessions.find(x => !this.sessions.some(y => y.sessionId === x.sessionId));
    }

    replaceSession(event) {
      const idx = this.consumedSessions.findIndex(x => x.sessionId === event.sessionId);
      const session = Object.assign({}, this.consumedSessions[idx]);
      logger.debug(`moving session from consumedSessions back into sessions. ${session}`);
      delete session.used;
      delete session.appointmentId;
      this.sessions.push(session);
      this.consumedSessions.slice(idx, 1);
    }

    getUsedSessionByAppointmentId(appointmentId) {
      return this.consumedSessions.find(x => x.appointmentId === appointmentId);
    }

    modifyConsumedSession(event) {
      this.consumedSessions.map(x =>
        x.sessionId === event.sessionId
          ? Object.assign({}, x, { appointmentId: event.appointmentId })
          : x);
    }
  };
};
