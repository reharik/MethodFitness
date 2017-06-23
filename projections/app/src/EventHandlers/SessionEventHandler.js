module.exports = function(rsRepository, moment, logger) {
  return function SessionEventHandler() {
    logger.info('SessionEventHandler started up');

    async function sessionsPurchased(event) {
      logger.info('handling sessionsPurchased event');
      //meaning the client had an unfunded appointment

      let clientSessions = await rsRepository.getById(event.clientId, 'clientSessions');
      if (Object.keys(clientSessions) <= 0) {
        clientSessions = {
          id: event.clientId,
          fullHour: [],
          halfHour: [],
          pair: []
        };
      }
      event.sessions.forEach(x => {
        if (!event.used) {
          if (!clientSessions[x.appointmentType]) {
            clientSessions[x.appointmentType] = [];
          }
          clientSessions[x.appointmentType].push(x);
        }
      });

      return await rsRepository.save('clientSessions', clientSessions);
    }

    async function appointmentAttendedByUnfundedClient(event) {
      return appointmentAttendedByClient(event);
    }

    async function appointmentAttendedByClient(event) {
      logger.info('handling appointmentAttendedByClient event');
      let clientSessions = await rsRepository.getById(event.clientId, 'clientSessions');
      if (clientSessions && event.sessionId && clientSessions[event.appointmentType]) {
        clientSessions[event.appointmentType] =
          clientSessions[event.appointmentType].filter(x => x.sessionId !== event.sessionId);
        return await rsRepository.save('clientSessions', clientSessions);
      }
    }

    return {
      handlerName: 'SessionEventHandler',
      sessionsPurchased,
      appointmentAttendedByClient,
      appointmentAttendedByUnfundedClient
    };
  };
};
