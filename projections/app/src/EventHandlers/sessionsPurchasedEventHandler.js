module.exports = function(
  rsRepository,
  moment,
  sessionsPurchasedPersistence,
  statefulEventHandler,
  metaLogger,
  logger,
) {
  return async function sessionsPurchasedEventHandler() {
    logger.info('SessionsPurchasedEventHandler started up');

    async function fundedAppointmentAttendedByClient(event) {
      rsRepository = await rsRepository;
      const purchases = rsRepository.getById(
        event.clientId,
        'sessionsPurchased',
      );
      const purchase = purchases.find(x => x.purchaseId === event.purchaseId);
      const session = purchase.sessions.find(x => x.id === event.sessionId);

      session.appointmentId = event.appointmentId;
      session.appointmentDate = event.date;
      session.startTime = event.startTime;

      return await rsRepository.save(
        'sessionsPurchased',
        purchases,
        event.clientId,
      );

    }

    async function pastAppointmentUpdated(event) {

      for(let client of event.clients) {
        rsRepository = await rsRepository;
        const purchases = rsRepository.getById(
          client.clientId,
          'sessionsPurchased',
        );

        const purchase = purchases.find(purch => purch.sessions.any(
          x => x.appointmentId === event.appointmentId && x.clientId === client.clientId,
        );

        let session = purchase.find(x => x.appointmentId === event.appointmentId && x.clientId === client.clientId);
        if (session) {
          session.trainerId = event.trainerId;
          session.appointmentDate = event.date;
          session.startTime = event.startTime;

          await rsRepository.save(
            'sessionsPurchased',
            purchases,
            client.clientId,
          );
        }
      }
    }

    async function sessionsPurchased(event) {
      rsRepository = await rsRepository;
      const purchase = {
        purchaseTotal: event.purchaseTotal,
        purchaseDate: event.purchaseDate,
        purchaseId: event.purchaseId,
        clientId: event.clientId,
      };


      innerState.sessions
        .filter(x => x.purchaseId === purchase.purchaseId && !!x.appointmentId)
        .forEach(session => {
          const appointment = innerState.appointments.find(
            a => a.appointmentId === session.appointmentId,
          );
          const trainer = innerState.trainers.find(
            t => t.trainerId === appointment.trainerId,
          );
          session.appointmentDate = appointment.date;
          session.startTime = appointment.startTime;
          session.trainer = `${trainer.firstName} ${trainer.lastName}`;
        });
      innerState.purchases.push(purchase);
      const purchase = state.sessionsPurchased(event);
      return await persistence.saveState(state, purchase);
    }

    async function sessionsRefunded(event) {
      const purchases = state.refundSessions(event);
      for (let p of purchases) {
        await persistence.saveState(state, p);
      }
    }

    async function sessionReturnedFromPastAppointment(event) {
      const purchase = state.sessionReturnedFromPastAppointment(event);
      await persistence.saveState(state, purchase);
    }

    async function sessionTransferredFromRemovedAppointmentToUnfundedAppointment(
      event,
    ) {
      let purchase = state.transferSessionFromPastAppointment(event);
      await persistence.saveState(state, purchase);
    }

    async function trainerPaid(event) {
      state.cleanUp(event);
      return await persistence.saveState(state);
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
        handlerType: 'sessionsPurchasedEventHandler',
        handlerName: 'sessionsPurchasedEventHandler',
        baseHandlerName: 'sessionsPurchasedBaseStateEventHandler',
        baseHandler,
        fundedAppointmentAttendedByClient,
        pastAppointmentUpdated,
        sessionsPurchased,
        sessionsRefunded,
        sessionReturnedFromPastAppointment,
        sessionTransferredFromRemovedAppointmentToUnfundedAppointment,
        trainerPaid,
      },
      'sessionPurchasedEventHandler',
    );
  };
};
