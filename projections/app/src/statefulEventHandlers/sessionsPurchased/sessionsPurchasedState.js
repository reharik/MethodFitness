module.exports = function(R, metaLogger) {
  return function sessionsPurchasedState(innerState) {

    const cleanUp = event => {
      // remove paid appointments
      const appointmentIds = event.paidAppointments.map(x => x.appointmentId);
      innerState.appointments = innerState.appointments.filter(x => !appointmentIds.includes(x.appointmentId));

      const purchaseIds = R.uniqBy(x => x.purchaseId, innerState.sessions).map(x => x.purchaseId);
      purchaseIds.forEach(x => {
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
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);

      session.appointmentId = appointment.appointmentId;
      session.appointmentDate = appointment.date;
      session.startTime = appointment.startTime;
      session.trainer = `${trainer.firstName} ${trainer.lastName}`;

      return getPurchase(session.purchaseId);
    };

    const getPurchase = purchaseId => {
      let purchase = innerState.purchases.find(x => x.purchaseId === purchaseId);
      if (purchase) {
        const sessions = innerState.sessions.filter(s => s.purchaseId === purchaseId);
        return Object.assign({}, purchase, { sessions });
      }
      return undefined;
    };

    const pastAppointmentUpdated = event => {
      let purchaseIds = [];
      event.clients.forEach(c => {
        let session = innerState.sessions
          .find(x =>
            x.appointmentId === event.appointmentId
          && x.clientId === c);
        if (session
          && (session.appointmentDate !== event.date
          || session.startTime !== event.startTime
          || session.trainerId !== event.trainerId)) {
          if (session.trainerId !== event.trainerId) {
            const trainer = innerState.trainers.find(t => t.trainerId === event.trainerId);
            session.trainer = `${trainer.firstName} ${trainer.lastName}`;
          }
          session.appointmentDate = event.date;
          session.startTime = event.startTime;
          purchaseIds.push(session.purchaseId);
        }
      });
      return purchaseIds.map(getPurchase);
    };

    const refundSessions = event => {
      let purchaseIds = [];
      // stateful eventhandler handles the refund this is just to rebuild the purchases
      event.refundSessions.map(x => {
        let session = innerState.sessions.find(y => y.sessionId === x.sessionId);
        if (!purchaseIds.includes(session.purchaseId)) {
          purchaseIds.push(session.purchaseId);
        }
      });
      return purchaseIds.map(getPurchase);
    };

    const sessionReturnedFromPastAppointment = event => {
      let session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      delete session.trainer;
      delete session.startTime;
      delete session.appointmentDate;

      return getPurchase(session.purchaseId);
    };

    const sessionsPurchased = item => {
      const purchase = createPurchase(item);
      innerState.sessions
        .filter(x => x.purchaseId === purchase.purchaseId && !!x.appointmentId)
        .forEach(session => {
          const appointment = innerState.appointments.find(a => a.appointmentId === session.appointmentId);
          const trainer = innerState.trainers.find(t => t.trainerId === appointment.trainerId);
          session.appointmentDate = appointment.date;
          session.startTime = appointment.startTime;
          session.trainer = `${trainer.firstName} ${trainer.lastName}`;
        });
      innerState.purchases.push(purchase);
      return getPurchase(purchase.purchaseId);
    };

    const transferSessionFromPastAppointment = event => {
      let session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      const appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      const trainer = innerState.trainers.find(t => t.trainerId === appointment.trainerId);
      session.trainer = `${trainer.firstName} ${trainer.lastName}`;
      session.startTime = appointment.startTime;
      session.appointmentDate = appointment.appointmentDate;
      return getPurchase(session.purchaseId);
    };

    return metaLogger({
      cleanUp,
      fundedAppointmentAttendedByClient,
      getPurchase,
      pastAppointmentUpdated,
      refundSessions,
      sessionReturnedFromPastAppointment,
      sessionsPurchased,
      transferSessionFromPastAppointment,
      innerState
    }, 'sessionsPurchasedState');
  };
};

