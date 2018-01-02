module.exports = function(moment,
                          appointmentWatcher,
                          clientWatcher,
                          trainerWatcher,
                          invariant,
                          metaLogger) {

  return function statefulEventHandler(state, persistence, handlerName) {

    async function fundedAppointmentAttendedByClient(event) {
      state.sessions = state.sessions.map(x => {
        if (x.sessionId === event.sessionId) {
          return Object.assign({}, x, { used: true, appointmentId: event.appointmentId });
        }
        return x;
      });

      return await persistence.saveState(state);
    }

    async function pastAppointmentRemoved(event) {
      state.appointments = state.appointments.filter(x => x.appointmentId !== event.appointmentId);

      return state;
    }

    async function pastAppointmentUpdated(event) {
      event.clients.forEach(c => {
        let session = state.sessions .find(x =>
          x.appointmentId === event.appointmentId
          && x.clientId === c.clientId);
        if (session && session.trainerId !== event.trainerId) {
          session.trainerId = event.trainerId;
        }
      });

      return await persistence.saveState(state);
    }

    async function sessionsPurchased(event) {
      let sessions = event.sessions.map(x => ({
        used: !!x.appointmentId,
        sessionId: x.sessionId,
        purchaseId: event.purchaseId,
        appointmentId: x.appointmentId,
        // trainerId: x.trainerId,
        appointmentType: x.appointmentType,
        purchasePrice: x.purchasePrice,
        clientId: x.clientId
      }));
      state.sessions.concat(sessions);

      return await persistence.saveState(state);
    }

    async function sessionsRefunded(event) {
      event.refundSessions.forEach(x => {
        let session = state.sessions.find(y => y.sessionId === x.sessionId);
        session.refunded = true;
      });

      return await persistence.saveState(state);
    }

    async function sessionReturnedFromPastAppointment(event) {
      let session = state.sessions.find(x =>
        x.appointmentId === event.appointmentId
        && x.sessionId === event.sessionId
      );
      if (session) {
        session.used = false;
        delete session.appointmentId;
        delete session.verified;
      }

      return await persistence.saveState(state);
    }

    async function trainersClientRateChanged(event) {
      state.trainers = state.trainers.map(t => {
        if (t.trainerId === event.trainerId) {
          t.TCRS.map(c => c.clientId === event.clientId ? Object.assign(c, { rate: event.rate }) : c);
          return t;
        }
        return t;
      });

      return await persistence.saveState(state);
    }

    async function trainersClientRatesUpdated(event) {
      event.clientRates.forEach(cr => trainersClientRateChanged({
        trainerId: event.trainerId,
        clientId: cr.clientId,
        rate: cr.rate
      }));

      return await persistence.saveState(state);
    }

    async function trainerClientRemoved(event) {
      state.trainers = state.trainers.map(x => {
        if (x.trainerId === event.trainerId) {
          x.TCRS.filter(c => c.clientId !== event.clientId);
          return x;
        }
        return x;
      });

      return await persistence.saveState(state);
    }

    async function trainersNewClientRateSet(event) {
      let trainer = state.trainers.find(x => x.trainerId === event.trainerId);
      invariant(trainer, `Unable to find trainer with ID: ${event.trainerId}`);
      trainer.TCRS.push({ clientId: event.clientId, rate: event.rate });

      return await persistence.saveState(state);
    }

    async function trainerPaid(event) {
      state.sessions = state.sessions.map(x =>
        event.paidAppointments.some(y => x.sessionId === y.sessionId)
          ? Object.assign(x, { verified: true })
          : x
        );
      state.appointments = state.appointments
        .filter(x => !event.paidAppointments.some(y => x.sessionId === y.sessionId));

      return await persistence.saveState(state);
    }

    async function trainerVerifiedAppointments(event) {
      state.appointments = state.appointments
        .map(x => event.sessionsIds.some(y => x.sessionId === y) ? Object.assign(x, { verified: true }) : x);

      return await persistence.saveState(state);
    }

    async function transferSessionFromPastAppointment(event) {
      let session = state.sessions.find(x => x.sessionId === event.sessionId);
      session.appointmentId = event.appointmentId;

      return await persistence.saveState(state);
    }

    const output = metaLogger({
      handlerType: handlerName,
      handlerName,
      fundedAppointmentAttendedByClient,
      pastAppointmentRemoved,
      pastAppointmentUpdated,
      sessionsPurchased,
      sessionsRefunded,
      sessionReturnedFromPastAppointment,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainersClientRatesUpdated,
      trainersNewClientRateSet,
      trainerPaid,
      trainerVerifiedAppointments,
      transferSessionFromPastAppointment
    }, handlerName);

    return Object.assign(
      appointmentWatcher(state, persistence, output.handlerName),
      clientWatcher(state, persistence, output.handlerName),
      trainerWatcher(state, persistence, output.handlerName),
      output
    );
  };
};
