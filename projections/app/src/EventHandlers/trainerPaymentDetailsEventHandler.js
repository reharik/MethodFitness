module.exports = function(rsRepository, moment, metaLogger, logger) {
  return async function trainerPaymentDetails() {
    logger.info('trainerPaymentDetailsEventHandler started up');

    async function trainerPaid(event) {
      rsRepository = await rsRepository;
      let trainer = await rsRepository.getById(
        event.trainerId,
        'trainerPaymentDetails',
      );

      if (!trainer || Object.keys(trainer).length === 0) {
        trainer = {
          payments: [],
        };
      }

      let paidAppointments = event.paidAppointments.map(x => ({
        trainerId: x.trainerId,
        clientId: x.clientId,
        clientName: `${x.clientLastName}, ${x.clientFirstName}`,
        appointmentId: x.appointmentId,
        appointmentDate: x.appointmentDate,
        startTime: x.startTime,
        appointmentType: x.appointmentType,
        sessionId: x.sessionId,
        pricePerSession: x.pricePerSession,
        //possibly set this to default TCR if 0
        trainerPercentage: x.trainerPercentage,
        trainerPay: x.trainerPay,
      }));
      const payment = {
        paymentId: event.paymentId,
        paymentDate: moment().utcOffset(-5).toISOString(),
        paidAppointments,
        paymentTotal: paidAppointments.reduce((a, b) => a + b.trainerPay, 0),
      };

      trainer.payments.push(payment);

      return await rsRepository.save(
        'trainerPaymentDetails',
        trainer,
        event.trainerId,
      );
    }

    return metaLogger(
      {
        handlerName: 'trainerPaymentDetailsEventHandler',
        trainerPaid,
      },
      'trainerPaymentDetailsEventHandler',
    );
  };
};
