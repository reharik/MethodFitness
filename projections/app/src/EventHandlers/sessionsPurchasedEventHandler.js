module.exports = function(rsRepository, metaLogger, logger) {
  return async function sessionsPurchasedEventHandler() {
    logger.info('SessionsPurchasedEventHandler started up');

    async function fundedAppointmentAttendedByClient(event) {
      rsRepository = await rsRepository;
      const client = await rsRepository.getById(
        event.clientId,
        'sessionsPurchased',
      );
      let session = client.sessions.find(x => x.sessionId === event.sessionId);

      session.appointmentId = event.appointmentId;
      session.appointmentDate = event.appointmentDate;
      session.startTime = event.startTime;

      return await rsRepository.save(
        'sessionsPurchased',
        client,
        event.clientId,
      );
    }

    async function pastAppointmentUpdated(event) {
      for (let client of event.clients) {
        rsRepository = await rsRepository;
        let clientPurchases = await rsRepository.getById(
          client.clientId,
          'sessionsPurchased',
        );
        if (!clientPurchases || Object.keys(clientPurchases).length === 0) {
          clientPurchases = {
            clientId: event.clientId,
            purchases: [],
            sessions: [],
          };
        }
        let session = clientPurchases.sessions.find(
          x =>
            x.appointmentId === event.appointmentId &&
            x.clientId === client.clientId,
        );
        if (session) {
          session.trainerId = event.trainerId;
          session.appointmentDate = event.appointmentDate;
          session.startTime = event.startTime;

          await rsRepository.save(
            'sessionsPurchased',
            clientPurchases,
            client.clientId,
          );
        }
      }
    }

    async function sessionsPurchased(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(
        event.clientId,
        'sessionsPurchased',
      );

      if (!client || Object.keys(client).length === 0) {
        client = {
          clientId: event.clientId,
          purchases: [],
          sessions: [],
        };
      }

      const purchase = {
        purchaseTotal: event.purchaseTotal,
        purchaseDate: event.purchaseDate,
        purchaseId: event.purchaseId,
        clientId: event.clientId,
      };
      const sessions = event.sessions.map(x => ({
        used: !!x.appointmentId,
        sessionId: x.sessionId,
        purchaseId: event.purchaseId,
        appointmentId: x.appointmentId,
        appointmentType: x.appointmentType,
        appointmentDate: x.appointmentDate,
        startTime: x.startTime,
        purchasePrice: x.purchasePrice,
        clientId: x.clientId,
        legacyId: x.legacyId,
      }));

      client.purchases.push(purchase);
      client.sessions = client.sessions.concat(sessions);

      await rsRepository.save('sessionsPurchased', client, client.clientId);
    }

    async function sessionsRefunded(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(
        event.clientId,
        'sessionsPurchased',
      );

      event.refundedSessions.forEach(r => {
        let session = client.sessions.find(s => s.sessionId === r.sessionId);
        session.refunded = true;
      });

      await rsRepository.save('sessionsPurchased', client, client.clientId);
    }

    async function sessionReturnedFromPastAppointment(event) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(
        event.clientId,
        'sessionsPurchased',
      );
      let session = client.sessions.find(x => x.sessionId === event.sessionId);
      session.used = false;
      delete session.appointmentId;
      delete session.startTime;
      delete session.appointmentDate;

      await rsRepository.save('sessionsPurchased', client, client.clientId);
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(
      event,
    ) {
      rsRepository = await rsRepository;
      let client = await rsRepository.getById(
        event.clientId,
        'sessionsPurchased',
      );

      let session = client.sessions.find(x => x.sessionId === event.sessionId);
      session.used = true;
      session.appointmentDate = event.appointmentDate;
      session.appointmentId = event.appointmentId;
      session.startTime = event.startTime;

      await rsRepository.save('sessionsPurchased', client, client.clientId);
    }

    /*
    async function unfundedAppointmentFundedByClient(event) {
      logger.info('handling unfundedAppointmentFundedByClient event in SessionsPurchasedEventHandler');
      const purchaseId = state.processFundedAppointment(event);
      const purchase = state.getPurchase(purchaseId);
      return await persistence.saveState(state, purchase);
    }
*/

    return metaLogger(
      {
        handlerName: 'sessionsPurchasedEventHandler',
        fundedAppointmentAttendedByClient,
        pastAppointmentUpdated,
        sessionsPurchased,
        sessionsRefunded,
        sessionReturnedFromPastAppointment,
        sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
      },
      'sessionPurchasedEventHandler',
    );
  };
};
