module.exports = function() {
  return function sessionsPurchasedState(state = {}) {
    let innerState = {
      id: state.id || '00000000-0000-0000-0000-000000000001',
      clients: state.clients || [],
      trainers: state.trainers || [],
      appointments: state.appointments || [],
      sessions: state.sessions || [],
      purchases: state.purchases || []
    };

    const sessionsPurchased = item => {
      innerState.purchases.push(createPurchase(item));
      innerState.sessions = innerState.sessions.concat(createSessions(item));
    };

    const processFundedAppointment = item => {
      let session = innerState.sessions.find(x => x.sessionId === item.sessionId);
      let appointment = innerState.appointments.find(x => x.id === item.appointmentId);
      let trainer = innerState.trainers.find(x => x.id === appointment.trainerId);

      session.appointmentId = appointment.id;
      session.appointmentDate = appointment.date;
      session.startTime = appointment.startTime;
      session.trainer = `${trainer.firstName} ${trainer.lastName}`;
      return session.purchaseId;
    };

    const refundSessions = event => {
      let purchaseIds = [];
      event.refundSessions.map(x => {
        let session = innerState.sessions.find(y => x === y.sessionId);
        session.refunded = true;
        if (!purchaseIds.includes(session.purchaseId)) {
          purchaseIds.push(session.purchaseId);
        }
      });
      return purchaseIds;
    };

    const cleanUp = purchase => {
      if (purchase.sessions.every(x => !!x.appointmentId || x.refunded)) {
        purchase.sessions.forEach(x => {
          innerState.appointments = innerState.appointments.filter(a => a.appointmentId !== x.appointmentId);
          innerState.sessions = innerState.sessions.filter(s => s.sessionId !== x.sessionId);
        });
        innerState.purchases = innerState.purchases.filter(p => p.purchaseId !== purchase.purchaseId);
      }
    };

    const createPurchase = item => {
      return {
        purchaseTotal: item.purchaseTotal,
        purchaseDate: item.purchaseDate,
        purchaseId: item.id,
        clientId: item.clientId
      };
    };

    const createSessions = item => {
      return item.sessions.map(x => ({
        sessionId: x.sessionId,
        purchaseId: item.id,
        appointmentId: x.appointmentId,
        appointmentType: x.appointmentType,
        purchasePrice: x.purchasePrice,
        clientId: x.clientId
      }));
    };

    const buildPurchase = purchaseId => {
      const purchase = innerState.purchases.find(x => x.purchaseId === purchaseId);
      purchase.sessions = innerState.sessions.filter(x => x.purchaseId === purchaseId);
      cleanUp(purchase);
      return purchase;
    };

    return {
      buildPurchase,
      createSessions,
      createPurchase,
      cleanUp,
      processFundedAppointment,
      sessionsPurchased,
      refundSessions,
      innerState
    };
  };
};
