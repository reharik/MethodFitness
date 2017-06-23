module.exports = function(rsRepository, logger) {
  let fetchTrainerPayments = async function(ctx) {
    logger.debug('arrived at trainerPaymentsList.fetchTrainerPayments');
    try {
      const result = await rsRepository.getById(ctx.state.user.id, 'trainerPayments');
      const body = result.payments;
      ctx.body = body.payments ? body.payments : [];
      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };

  let fetchTrainerPaymentDetails = async function(ctx) {
    logger.debug('arrived at trainerPaymentsList.fetchTrainerPaymentDetails');
    try {
      let body = await rsRepository.getById(ctx.state.user.id, 'trainerPayments');
      ctx.body = body.payments ? body.payments : [];
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
