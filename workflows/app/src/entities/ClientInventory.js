module.exports = function(sortby) {
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
        this.consumedSessions.push(Object.assign({}, session, {appointmentId}));
      }
      this.sessions = this.sessions.filter(x => x.sessionId !== sessionId);
    }

    sessionsExists(cmd) {
      return !cmd.refundSessions.find(x => !this.sessions.some(y => y.sessionId === x));
    }

    replaceSession(event) {
      const session = this.consumedSessions.find(x => x.sessionId === event.sessionId);
      delete session.used;
      delete session.appointmentId;
      this.sessions.push(session);
    }

    getUsedSessionByAppointmentId(appointmentId) {
      return this.consumedSessions.find(x => x.appointmentId === appointmentId);
    }
  };
};
