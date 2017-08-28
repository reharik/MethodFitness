module.exports = function(rsRepository, logger) {
  let fetchTrainerPayments = async function(ctx) {
    logger.debug('arrived at trainerPaymentsList.fetchTrainerPayments');
    try {
      ctx.body = await rsRepository.getById(ctx.state.user.trainerId, 'trainerPayments');
      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };

  let fetchTrainerPaymentDetails = async function(ctx) {
    logger.debug('arrived at trainerPaymentsList.fetchTrainerPaymentDetails');
    try {
      let result = await rsRepository.getById(ctx.state.user.trainerId, 'trainerPaymentDetails');
      ctx.body = result && result.payments
        ? result.payments.filter(x => x.paymentId === ctx.params.paymentId)
        : [];
      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };
  return {
    fetchTrainerPayments,
    fetchTrainerPaymentDetails
  };
};
