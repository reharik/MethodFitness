module.exports = function(moment, invariant, metaLogger) {
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
      innerState.sessions.push(item);
    };

    const cleanUp = () => {
      innerState.paidAppointments.forEach(x => {
        let appointment = innerState.appointments.find(a => a.appointmentId === x.appointmentId);
        // remove appointment
        if (appointment.appointmentType !== 'pair' || appointment.clients.length === 1) {
          innerState.appointments = innerState.appointments.filter(a => a.appointmentId !== appointment.id);
        }
        // remove paid client from pair
        if (appointment.appointmentType === 'pair') {
          appointment.clients = appointment.clients.filter(c => c.clientId !== x.clientId);
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
      let appointment = innerState.appointments.find(x => x.appointmentId === item.appointmentId);
      let session = innerState.sessions.find(s => s.sessionId === item.sessionId);
      let client = innerState.clients.find(c => c.clientId === session.clientId);
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
        trainerPay: TR
      };
    };

    const refundSessions = event => {
      innerState.sessions = innerState
        .sessions
        .filter(x => !event.refundSessions.some(y => y.sessionId === x.sessionId));
    };

    const sessionReturnedFromPastAppointment = event => {
      innerState.sessions = innerState
        .sessions
        .map(x => {
          if (x.appointmentId === event.appointmentId && x.sessionId === event.sessionId) {
            let newSession = Object.assign({}, x, {used: false} );
            delete newSession.appointmentId;
            return newSession;
          }
          return x;
        });
    };

    const appointmentAttendedByClient = event => {
      innerState.sessions = innerState
        .sessions
        .map(x => {
          if (x.sessionId === event.sessionId) {
            return Object.assign({}, x, { used: true, appointmentId: event.appointmentId });
          }
          return x;
        });
    };

    return metaLogger({
      innerState,
      createPaidAppointment,
      processPaidAppointments,
      addSession,
      removeTCR,
      updateTCR,
      addTRC,
      refundSessions,
      sessionReturnedFromPastAppointment,
      appointmentAttendedByClient
    }, 'trainerPaymentDetailsState');
  };
};
