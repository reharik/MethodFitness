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

    const processPaidAppointments = event => {
      let paidAppointments = event.paidAppointments.map(x => createPaidAppointment(x));
      return {
        paymentId: event.paymentId,
        paymentDate: moment().toISOString(),
        paidAppointments,
        paymentTotal: paidAppointments.reduce((a, b) => a + b.trainerPay, 0)
      };
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

    return metaLogger({
      innerState,
      processPaidAppointments
    }, 'trainerPaymentDetailsState');
  };
};
