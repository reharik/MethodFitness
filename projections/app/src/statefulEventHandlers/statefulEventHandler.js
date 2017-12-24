module.exports = function(moment,
                          metaLogger) {

  return function statefulEventHandler(state, handlerName) {
    function trainersNewClientRateSet(event) {
      let trainer = state.trainers.find(x => x.trainerId === event.trainerId);
      invariant(trainer, `Unable to find trainer with ID: ${trainerId}`);
      trainer.TCRS.push({ clientId: event.clientId, rate: event.rate });

      return state;
    }

    function trainersClientRateChanged(event) {
      state.trainers = state.trainers.map(t => {
        if (t.trainerId === event.trainerId) {
          t.TCRS.map(c => c.clientId === event.clientId ? Object.assign(c, { rate: event.rate }) : c);
          return t;
        }
        return t;
      });

      return state;
    }

    function trainersClientRatesUpdated(event) {
      event.clientRates.forEach(cr => trainersClientRateChanged({
        trainerId: event.trainerId,
        clientId: cr.clientId,
        rate: cr.rate
      }));

      return state;
    }

    function trainerClientRemoved(event) {
      state.trainers = state.trainers.map(x => {
        if (x.trainerId === event.trainerId) {
          x.TCRS.filter(c => c.clientId !== item.clientId);
          return x;
        }
        return x;
      });

      return state;
    }

    function sessionsPurchased(event) {
      let sessions = event.sessions.map(x => ({
        used: !!x.appointmentId,
        sessionId: x.sessionId,
        purchaseId: event.purchaseId,
        appointmentId: x.appointmentId,
        trainerId: x.trainerId,
        appointmentType: x.appointmentType,
        purchasePrice: x.purchasePrice,
        clientId: x.clientId
      }));
      state.sessions.concat(sessions);

      return state;
    }

    function appointmentAttendedByClient(event) {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }
      state.sessions = state.sessions.map(x => {
        if (x.sessionId === event.sessionId) {
          return Object.assign({}, x, { used: true, appointmentId: event.appointmentId });
        }
        return x;
      });

      return state;
    }


    function trainerVerifiedAppointments(event) {
      state.appointments = state.appointments
        .map(x => event.sessionsIds.some(y => x.sessionId === y) ? Object.assign(x, { verified: true }) : x);

      return state;
    }

    function trainerPaid(event) {
      state.sessions = state.sessions.filter(x => !event.paidAppointments.some(y => x.sessionId === y.sessionId));
      state.appointments = state.appointments.filter(x => !paidAppointments.some(y => x.sessionId === y.sessionId));

      return state;
    }

    function sessionsRefunded(event) {
      event.refundSessions.forEach(x => {
        let session = state.sessions.find(y => y.sessionId === x.sessionId);
        session.refunded = true;
      });

      return state;
    }

    function pastAppointmentRemoved(event) {
      state.appointments = state.appointments.filter(x => x.appointmentId !== event.appointmentId);

      return state;
    }

    function sessionReturnedFromPastAppointment(event) {
      let session = state
        .sessions
        .find(x => x.appointmentId === event.appointmentId && x.sessionId === event.sessionId);
      if (session) {
        session.used = false;
        delete session.appointmentId;
        delete session.verified;
      }

      return state;
    }

    function pastAppointmentUpdated(event) {
      event.clients.forEach(c => {
        let session = state.sessions
          .find(x => x.appointmentId === event.appointmentId);
        if (session && session.trainerId !== event.trainerId) {
          session.trainerId = event.trainerId;
        }
      });

      return state;
    }

    return metaLogger({
      handlerType: handlerName,
      handlerName,
      trainerVerifiedAppointments,
      appointmentAttendedByClient,
      sessionsPurchased,
      trainerClientRemoved,
      trainersClientRateChanged,
      trainersClientRatesUpdated,
      trainersNewClientRateSet,
      trainerPaid,
      sessionsRefunded,
      pastAppointmentRemoved,
      sessionReturnedFromPastAppointment,
      pastAppointmentUpdated
    }, handlerName);
  };
};
