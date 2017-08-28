module.exports = function(invariant) {
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

    const addSession = item => {
      if (!item.used) {
        innerState.sessions.push(item);
      }
    };

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

    const processFundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments.push(createUnpaidAppointment(appointment, event));
      return appointment.trainerId;
    };

    const processUnfundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unfundedAppointments.push(createUnfundedAppointment(appointment, event));
      return appointment.trainerId;
    };

    const processNewlyFundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.appointmentId === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments.push(fundUnfundedAppointment(event, appointment));
      innerState.unfundedAppointments = innerState.unfundedAppointments
        .filter(x => x.appointmentId !== event.appointmentId && x.clientId !== event.clientId);
      return appointment.trainerId;
    };

    const fundUnfundedAppointment = (event, appointment) => {
      let unfunded = innerState.unfundedAppointments
        .find(x => x.appointmentId === event.appointmentId && x.clientId === event.clientId);
      let client = innerState.clients.find(c => c.clientId === event.clientId);
      let trainer = innerState.trainers.find(x => x.trainerId === appointment.trainerId);
      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.clientId);
      let TR = TCR ? event.purchasePrice * (TCR.rate * .01) : 0;
      unfunded.sessionId = event.sessionId;
      unfunded.pricePerSession = event.purchasePrice;
      //possibly set this to default TCR if 0
      unfunded.trainerPercentage = TCR ? TCR.rate : 0;
      unfunded.trainerPay = TR;
      unfunded.verified = false;
      return unfunded;
    };

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
      innerState.sessions = innerState.sessions.filter(x => !event.refundSessions.find(y => y === x.sessionId));
    };

    const pastAppointmentRemoved = event => {
      let trainerId;
      innerState.appointments = innerState.appointments.filter(x => x.appointmentId !== event.appointmentId);
      let appt = innerState.unpaidAppointments.find(x => x.appointmentId === event.appointmentId);
      if (appt) {
        trainerId = appt.trainerId;
      }
      appt = innerState.unfundedAppointments.find(x => x.appointmentId === event.appointmentId);
      if (appt) {
        trainerId = appt.trainerId;
      }
      innerState.unpaidAppointments = innerState.unpaidAppointments
        .filter(x => x.appointmentId !== event.appointmentId);
      innerState.unfundedAppointments = innerState.unfundedAppointments
        .filter(x => x.appointmentId !== event.appointmentId);
      return trainerId;
    };

    return {
      innerState,
      createUnfundedAppointment,
      createUnpaidAppointment,
      processNewlyFundedAppointment,
      processUnfundedAppointment,
      processFundedAppointment,
      trainerPaid,
      sessionsVerified,
      addSession,
      removeTCR,
      updateTCR,
      addTRC,
      refundSessions,
      pastAppointmentRemoved
    };
  };
};
