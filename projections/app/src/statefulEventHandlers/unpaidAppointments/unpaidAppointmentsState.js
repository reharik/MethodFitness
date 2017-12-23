module.exports = function(invariant, metaLogger) {
  return function UnpaidAppointments(state = {}) {
    let innerState = {
      id: state.id || '00000000-0000-0000-0000-000000000001',
      clients: state.clients || [],
      trainers: state.trainers || [],
      appointments: state.appointments || [],
      sessions: state.sessions || [],
      unfundedAppointments: state.unfundedAppointments || [],
      unpaidAppointments: state.unpaidAppointments || []
    };
    const addTRC = (trainerId, item) => {
      let trainer = innerState.trainers.find(x => x.trainerId === trainerId);
      invariant(trainer, `Unable to find trainer with ID: ${trainerId}`);
      trainer.TCRS.push(item);
    };

    const updateTCR = item => {
      innerState.trainers = innerState.trainers.map(x => {
        if (x.trainerId === item.trainerId) {
          x.TCRS.map(c => c.clientId === item.clientId ? Object.assign(c, {rate: item.rate}) : c);
          return x;
        }
        return x;
      });
    };

    const removeTCR = item => {
      innerState.trainers = innerState.trainers.map(x => {
        if (x.trainerId === item.trainerId) {
          x.TCRS.filter(c => c.clientId !== item.clientId);
          return x;
        }
        return x;
      });
    };

    const addSession = item => innerState.sessions.push(item);

    const sessionsVerified = sessions => {
      innerState.unpaidAppointments = innerState.unpaidAppointments
        .map(x => sessions.some(y => x.sessionId === y) ? Object.assign(x, {verified: true}) : x);
    };

    const trainerPaid = sessions => {
      const paidAppointments = innerState.unpaidAppointments
        .filter(x => sessions.some(y => x.sessionId === y.sessionId));

      innerState.unpaidAppointments = innerState.unpaidAppointments
        .filter(x => !sessions.some(y => x.sessionId === y.sessionId));

      innerState.sessions = innerState.sessions.filter(x => !sessions.some(y => x.sessionId === y.sessionId));

      paidAppointments.filter(x =>
      !innerState.unpaidAppointments.some(y => x.appointmentId === y.appointmentId)
      && !innerState.unfundedAppointments.some(y => x.appointmentId === y.appointmentId))
        .forEach(a => innerState.appointments = innerState.appointments
          .filter(y => y.appointmentId !== a.appointmentId));
    };

    const removeUnfundedAppointment = (appointmentId, clientId) => {
      const predicate = clientId
        // this was a bit tricky because there were two conditions you can't do the negative
        ? x => !(x.appointmentId === appointmentId && x.clientId === clientId)
        : x => x.appointmentId !== appointmentId;
      innerState.unfundedAppointments = innerState.unfundedAppointments
        .filter(predicate);
    };

    const removeFundedAppointment = appointmentId => {
      let unpaidAppointment = innerState.unpaidAppointments.find(x => x.appointmentId === appointmentId);
      if (!unpaidAppointment || unpaidAppointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments = innerState.unpaidAppointments
        .filter(x => x.sessionId !== unpaidAppointment.sessionId);

      return unpaidAppointment.trainerId;
    };

    const transferSession = event => {
      let unpaidAppointment = innerState.unpaidAppointments.find(x => x.sessionId === event.sessionId);
      let unfundedAppointment = innerState.unfundedAppointments.find(x => x.appointmentId === event.appointmentId);
      if (!unpaidAppointment || !unfundedAppointment) {
        return undefined;
      }
      const session = innerState.sessions.find(x => x.sessionId === event.sessionId);
      const updatedEvent = Object.assign({}, event, { purchasePrice: session.purchasePrice });
      innerState.unpaidAppointments = innerState.unpaidAppointments.filter(x => x.sessionId !== updatedEvent.sessionId);
      innerState.unpaidAppointments.push(fundUnfundedAppointment(updatedEvent, unfundedAppointment.trainerId));
      removeUnfundedAppointment(updatedEvent.appointmentId, updatedEvent.clientId);

      return unpaidAppointment.trainerId;
    };

    const processAttendedUnfundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      // create new unfunded appointment
      innerState.unfundedAppointments.push(createUnfundedAppointment(appointment, event));
      return appointment.trainerId;
    };

    // someone bought a session
    const processNewlyFundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments.push(fundUnfundedAppointment(event, appointment.trainerId));
      removeUnfundedAppointment(event.appointmentId, event.clientId);

      return appointment.trainerId;
    };

    // someone attended an appointment and had a session
    const processAttendedFundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      // first we create new unpaid appointment
      innerState.unpaidAppointments.push(createUnpaidAppointment(appointment, event));

      // then clean up previously processed unfunded appt
      removeUnfundedAppointment(event.appointmentId, event.clientId);

      // then we update the session
      innerState.sessions = innerState
        .sessions
        .map(x => {
          if (x.sessionId === event.sessionId) {
            return Object.assign({}, x, { used: true, appointmentId: event.appointmentId });
          }
          return x;
        });
      return appointment.trainerId;
    };

    // from processNewlyFundedAppointment or removeFundedAppointment
    const fundUnfundedAppointment = (event, trainerId) => {
      let unfunded = innerState.unfundedAppointments
        .find(x => x.appointmentId === event.appointmentId && x.clientId === event.clientId);
      let trainer = innerState.trainers.find(x => x.trainerId === trainerId);
      let TCR = trainer.TCRS.find(tcr => tcr.clientId === event.clientId);
      let TR = TCR ? event.purchasePrice * (TCR.rate * .01) : 0;
      unfunded.sessionId = event.sessionId;
      unfunded.pricePerSession = event.purchasePrice;
      //possibly set this to default TCR if 0
      unfunded.trainerPercentage = TCR ? TCR.rate : 0;
      unfunded.trainerPay = TR;
      unfunded.verified = false;
      return unfunded;
    };

    // from processAttendedFundedAppointment
    const createUnpaidAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let session = innerState.sessions.find(s => s.sessionId === event.sessionId);

      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);

      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.clientId);
      let TR = 0;
      if (session && TCR) {
        TR = session.purchasePrice * (TCR.rate * .01);
      }

      return {
        trainerId: trainer.trainerId,
        clientId: client.clientId,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType,
        sessionId: session.sessionId,
        pricePerSession: session.purchasePrice,
        //possibly set this to default TCR if 0
        trainerPercentage: TCR ? TCR.rate : 0,
        trainerPay: TR,
        verified: false
      };
    };

    // from processAttendedUnfundedAppointment
    const createUnfundedAppointment = (appointment, event) => {
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);
      return {
        trainerId: trainer.trainerId,
        clientId: client.clientId,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.appointmentId,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType
      };
    };

    const refundSessions = event => {
      innerState.sessions = innerState
        .sessions
        .filter(x => !event.refundSessions.find(y => y.sessionId === x.sessionId));
    };

    const pastAppointmentRemoved = appointmentId => {
      // first we have to find the appointment so we can get the trainer Id
      const trainerId = innerState
        .appointments
        .filter(x => x.appointmentId === appointmentId)
        .map(x => x.trainerId);

      innerState.appointments = innerState.appointments.filter(x => x.appointmentId !== appointmentId);

      // try them both, they both check for null
      removeUnfundedAppointment(appointmentId);
      removeFundedAppointment(appointmentId);
      return trainerId;
    };

    const sessionReturnedFromPastAppointment = event => {
      let session = innerState
        .sessions
        .find(x => x.appointmentId === event.appointmentId && x.sessionId === event.sessionId);
      if (session) {
        session.used = false;
        delete session.appointmentId;
        return session.trainerId;
      }
      return undefined;
    };

    return metaLogger({
      innerState,
      createUnfundedAppointment,
      createUnpaidAppointment,
      processNewlyFundedAppointment,
      processAttendedUnfundedAppointment,
      processAttendedFundedAppointment,
      trainerPaid,
      sessionsVerified,
      addSession,
      removeTCR,
      updateTCR,
      addTRC,
      refundSessions,
      pastAppointmentRemoved,
      removeFundedAppointment,
      transferSession,
      sessionReturnedFromPastAppointment
    }, 'unpaidAppointmentState');
  };
};
