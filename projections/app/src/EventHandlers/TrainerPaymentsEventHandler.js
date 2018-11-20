module.exports = function(rsRepository, moment, metaLogger, logger) {
  return function TrainerPaymentEventHandler() {
    logger.info('TrainerPaymentsEventHandler started up');

    async function trainerPaid(event) {
      rsRepository = await rsRepository;
      let trainerPayments = await rsRepository.getById(
        event.trainerId,
        'trainerPayments',
      );
      trainerPayments = trainerPayments.payments
        ? trainerPayments
        : { trainerId: event.trainerId, payments: [] };
      trainerPayments.payments.push({
        paymentTotal: event.paymentTotal,
        paymentDate: event.datePaid,
        paymentId: event.paymentId,
        trainerId: event.trainerId,
      });
      return await rsRepository.save(
        'trainerPayments',
        trainerPayments,
        trainerPayments.trainerId,
      );
    }

    return metaLogger(
      {
        handlerName: 'TrainerPaymentEventHandler',
        trainerPaid,
      },
      'TrainerPaymentEventHandler',
    );
  };
};
