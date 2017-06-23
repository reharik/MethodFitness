module.exports = function(rsRepository, moment, logger) {
  return function TrainerPaymentEventHandler() {
    logger.info('TrainerPaymentsEventHandler started up');

    async function trainerPaid(event) {
      logger.info('handling trainerPaid event');
      let trainerPayments = await rsRepository.getById(event.trainerId, 'trainerPayments');
      trainerPayments = trainerPayments.payments ? trainerPayments : {id: event.trainerId, payments: []};
      trainerPayments.payments.push({
        paymentTotal: event.paymentTotal,
        paymentDate: event.datePaid,
        paymentId: event.paymentId,
        trainerId: event.trainerId
      });
      return await rsRepository.save('trainerPayments', trainerPayments);
    }

    return {
      handlerName: 'TrainerPaymentEventHandler',
      trainerPaid
    };
  };
};
