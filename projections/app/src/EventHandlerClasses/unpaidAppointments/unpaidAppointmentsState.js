module.exports = function(invariant) {
  return function UnpaidAppointments(state = {}) {
    let innerState = {
      id: state.id || '00000000-0000-0000-0000-000000000001',
      clients: state.clients || [],
      trainers: state.trainers || [],
      appointments: state.appointments || [],
      sessions: [],
      unfundedAppointments: state.unfundedAppointments || [],
      unpaidAppointments: state.unpaidAppointments || []
    };

    const addTRC = (trainerId, item) => {
      let trainer = innerState.trainers.find(x => x.id === trainerId);
      invariant(trainer, `Unable to find trainer with ID: ${trainerId}`);
      trainer.TCRS.push(item);
    };

    const updateTRC = item => {
      innerState.trainers = innerState.trainers.map(x => {
        if (x.id === item.trainerId) {
          x.TCRS.map(c => c.clientId === item.clientId ? Object.assign(c, {rate: item.rate}) : c);
          return x;
        }
        return x;
      });
    };

    const removeTCR = item => {
      innerState.trainers = innerState.trainers.map(x => {
        if (x.id === item.trainerId) {
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
        .forEach(x => innerState.appointments = innerState.appointments.filter(y => y.id !== x.appointmentId));
    };

    const processFundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.id === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unpaidAppointments.push(createUnpaidAppointment(appointment, event));
      return appointment.trainerId;
    };

    const processUnfundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.id === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return undefined;
      }

      innerState.unfundedAppointments.push(createUnfundedAppointment(appointment, event));
      return appointment.trainerId;
    };

    const processNewlyFundedAppointment = event => {
      let appointment = innerState.appointments.find(x => x.id === event.appointmentId);
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
      let client = innerState.clients.find(c => c.id === event.clientId);
      let trainer = innerState.trainers.find(x => x.id === appointment.trainerId);
      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.id);
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
      let client = innerState.clients.find(c => c.id === event.clientId);
      let session = innerState.sessions.find(s => s.sessionId === event.sessionId);

      let trainer = innerState.trainers.find(x => x.id === appointment.trainerId);

      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.id);
      let TR = 0;
      if (session && TCR) {
        TR = session.purchasePrice * (TCR.rate * .01);
      }

      return {
        trainerId: trainer.id,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.id,
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
      let client = innerState.clients.find(c => c.id === event.clientId);
      let trainer = innerState.trainers.find(x => x.id === appointment.trainerId);
      return {
        trainerId: trainer.id,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.id,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType
      };
    };

    const refundSessions = event => {
      innerState.sessions.filter(x => !event.refundSessions.some(y => y.sessionId === x.sessionId));
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
      updateTRC,
      addTRC,
      refundSessions
    };
  };
};
