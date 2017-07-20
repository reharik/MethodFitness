module.exports = function(sortby) {
  return class ClientInventory {
    constructor() {
      this.sessions = [];
    }

    addSessionsToInventory(event) {
      this.sessions = this.sessions.concat(event.sessions.filter(x => !x.used));
    }

    consumeSession(cmd) {
      return this.sessions
        .filter(x => x.appointmentType === cmd.appointmentType)
        .sort(sortby('createdDate'))[0];
    }

    removeSession(event) {
      this.sessions = this.sessions.filter(x => x.sessionId !== event.sessionId);
    }

    sessionsExists(cmd) {
      return !cmd.refundSessions.find(x => !this.sessions.some(y => y.sessionId === x.sessionId));
    }
  };
};
