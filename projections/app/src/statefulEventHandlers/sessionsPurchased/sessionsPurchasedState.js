module.exports = function(R, metaLogger) {
  return function sessionsPurchasedState(innerState) {

    const cleanUp = (event) => {
      // remove paid appointments
      const appointmentIds = event.paidAppointments.map(x => x.appointmentId);
      innerState.appointments = innerState.appointments.filter(x => !appointmentIds.includes(x.appointmentId));

      const purchaseIds = R.uniqBy(x => x.purchaseId, innerState.sessions).map(x => x.purchaseId);
      console.log(`==========purchaseIds=========`);
      console.log(purchaseIds); // eslint-disable-line quotes
      console.log(`==========END purchaseIds=========`);
      purchaseIds.forEach(x => {
        console.log(`==========x=========`);
        console.log(x); // eslint-disable-line quotes
        console.log(`==========END x=========`);
        if (innerState.sessions.filter(s => s.purchaseId === x).every(s => s.trainerPaid || s.refunded)) {
          // remove sessions when the entire purchase is used
          innerState.sessions = innerState.sessions.filter(s => s.purchaseId !== x);
          // remove purchase when all sessions are used;
          innerState.purchases = innerState.purchases.filter(p => p.purchaseId !== x);
        }
      });
    };

    const createPurchase = item => {
      return {
        purchaseTotal: item.purchaseTotal,
        purchaseDate: item.purchaseDate,
        purchaseId: item.purchaseId,
        clientId: item.clientId
      };
    };

    const fundedAppointmentAttendedByClient = event => {
      let session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      let purchase = innerState.purchases.find(x => x.purchaseId === session.purchaseId);
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);

      session.appointmentId = appointment.appointmentId;
      session.appointmentDate = appointment.date;
      session.startTime = appointment.startTime;
      session.trainer = `${trainer.firstName} ${trainer.lastName}`;

      purchase.sessions = innerState.sessions.filter(x => x.purchaseId === purchase.purchaseId);
      return purchase;
    };

    const getPurchase = purchaseId => {
      return innerState.purchases.find(x => x.purchaseId === purchaseId);
    };

    // this is probably fubar. I feel like I need to remove sessions and stuff but maybe that's taken care of
    // by other events
    const pastAppointmentUpdated = event => {
      let purchaseIds = [];
      event.clients.forEach(c => {
        let session = innerState.sessions
          .find(x =>
            x.appointmentId === event.appointmentId
          && x.clientId === c.clientId);
        if (session
          && (session.date !== event.date
          || session.startTime !== event.startTime)) {
          session.date = event.date;
          session.startTime = event.startTime;
          purchaseIds.push(session.purchaseId);
        }
      });
      return purchaseIds;
    };

    const refundSessions = event => {
      let purchaseIds = [];
      event.refundSessions.map(x => {
        let session = innerState.sessions.find(y => y.sessionId === x.sessionId);
        if (!purchaseIds.includes(session.purchaseId)) {
          purchaseIds.push(session.purchaseId);
        }
      });
      return purchaseIds.map(x => getPurchase(x));
    };

    const returnSessionsFromPastAppointment = event => {
      let session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      delete session.trainer;
      delete session.startTime;
      delete session.appointmentDate;
      // not sure if this is needed need to figure out if purchase.sessions are just references
      let purchase = innerState.purchases.find(x => x.purchaseId === session.purchaseId);
      purchase.sessions = innerState.sessions.filter(x => x.purchaseId === purchase.purchaseId);

      return purchase;
    };

    const sessionsPurchased = item => {
      const purchase = createPurchase(item);
      purchase.sessions = innerState.sessions.filter(x => x.purchaseId === item.purchaseId);
      purchase.sessions.filter(x => !!x.appointmentId).forEach(session => {
        const appointment = innerState.appointments.find(a => a.appointmentId === session.appointmentId);
        const trainer = innerState.trainers.find(t => t.trainerId === appointment.trainerId);
        session.appointmentDate = appointment.date;
        session.startTime = appointment.startTime;
        session.trainer = `${trainer.firstName} ${trainer.lastName}`;
      });
      innerState.purchases.push(purchase);
      return purchase;
    };


    const transferSessionFromPastAppointment = event => {
      let session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      let purchase = innerState.purchases.find(x => x.purchaseId === session.purchaseId);
      const appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      session.trainer = appointment.trainer;
      session.startTime = appointment.startTime;
      session.appointmentDate = appointment.appointmentDate;
      purchase.sessions = innerState.sessions.filter(x => x.purchaseId === purchase.purchaseId);
      return purchase;
    };

    return metaLogger({
      cleanUp,
      fundedAppointmentAttendedByClient,
      getPurchase,
      pastAppointmentUpdated,
      refundSessions,
      returnSessionsFromPastAppointment,
      sessionsPurchased,
      transferSessionFromPastAppointment,
      innerState
    }, 'sessionsPurchasedState');
  };
};

