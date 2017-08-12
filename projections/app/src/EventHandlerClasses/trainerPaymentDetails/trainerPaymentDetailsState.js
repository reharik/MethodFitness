module.exports = function(moment, invariant) {
  return function(state = {}) {
    let innerState = {
      id: state.id || '00000000-0000-0000-0000-000000000001',
      clients: state.clients || [],
      trainers: state.trainers || [],
      appointments: state.appointments || [],
      sessions: [],
      paidAppointments: state.paidAppointments || []
    };

    const addTRC = (trainerId, item) => {
      let trainer = innerState.trainers.find(x => x.id === trainerId);
      invariant(trainer, `Unable to find trainer with ID: ${trainerId}`);
      trainer.TCRS.push(item);
    };

    const updateTCR = item => {
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
      innerState.sessions.push(item);
    };

    const cleanUp = () => {
      innerState.paidAppointments.forEach(x => {
        let appointment = innerState.appointments.find(a => a.id === x.appointmentId);
        // remove appointment
        if (appointment.appointmentType !== 'pair' || appointment.clients.length === 1) {
          innerState.appointments = innerState.appointments.filter(a => a.id !== appointment.id);
        }
        // remove paid client from pair
        if (appointment.appointmentType === 'pair') {
          appointment.clients = appointment.clients.filter(c => c.id !== x.clientId);
        }
        innerState.sessions = innerState.sessions.filter(s => s.sessionId !== x.sessionId);
      });
      innerState.paidAppointments = [];
    };

    const processPaidAppointments = event => {
      event.paidAppointments.forEach(x => {
        innerState.paidAppointments.push(createPaidAppointment(x));
      });
      const payment = {
        paymentId: event.paymentId,
        paymentDate: moment().toISOString(),
        paidAppointments: innerState.paidAppointments,
        paymentTotal: innerState.paidAppointments.reduce((a, b) => a + b.trainerPay, 0)
      };
      cleanUp(event.paidAppointments);
      return payment;
    };

    const createPaidAppointment = item => {
      let appointment = innerState.appointments.find(x => x.id === item.appointmentId);
      let session = innerState.sessions.find(s => s.sessionId === item.sessionId);

      let client = innerState.clients.find(c => c.id === session.clientId);

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
        trainerPay: TR
      };
    };

    const refundSessions = event => {
      innerState.sessions = innerState.sessions.filter(x => !event.refundSessions.some(y => y === x.sessionId));
    };

    return {
      innerState,
      createPaidAppointment,
      processPaidAppointments,
      addSession,
      removeTCR,
      updateTCR,
      addTRC,
      refundSessions
    };
  };
};
