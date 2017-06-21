module.exports = function(rsRepository, moment, logger) {
  return function SessionEventHandler() {
    logger.info('SessionEventHandler started up');

    async function sessionPurchased(event) {
      logger.info('handling sessionPurchased event');
      //meaning the client had an unfunded appointment
      if (event.used) {
        return;
      }

      let clientSessions = await rsRepository.getById(event.clientId, 'clientSessions');
      if (Object.keys(clientSessions) <= 0) {
        clientSessions = {
          id: event.clientId,
          fullHour: [],
          halfHour: [],
          pair: []
        };
      }
      if (!clientSessions[event.appointmentType]) {
        clientSessions[event.appointmentType] = [];
      }
      clientSessions[event.appointmentType].push(event);
      return await rsRepository.save('clientSessions', clientSessions);
    }

    async function fullHourSessionPurchased(event) {
      return await sessionPurchased(event);
    }
    async function halfHourSessionPurchased(event) {
      return await sessionPurchased(event);
    }
    async function pairSessionPurchased(event) {
      return await sessionPurchased(event);
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
      fullHourSessionPurchased,
      halfHourSessionPurchased,
      pairSessionPurchased,
      appointmentAttendedByClient
    };
  };
};
