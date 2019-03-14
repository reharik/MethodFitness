module.exports = function(rsRepository, logger) {
  let fetchTrainerPayments = async function(ctx) {
    logger.debug('arrived at trainerPaymentsList.fetchTrainerPayments');
    let trainerId = ctx.state.user.trainerId;
    if(ctx.params.trainerId && ctx.state.user.role === 'admin') {
      trainerId = ctx.params.trainerId;
    }
    rsRepository = await rsRepository;
    try {
      ctx.body = await rsRepository.getById(
        trainerId,
        'trainerPayments',
      );
      ctx.status = 200;
      return ctx;
    } catch (ex) {
      throw ex;
    }
  };

  let fetchTrainerPaymentDetails = async function(ctx) {
    logger.debug('arrived at trainerPaymentsList.fetchTrainerPaymentDetails');
    let trainerId = ctx.state.user.trainerId;
    if(ctx.params.trainerId && ctx.state.user.role === 'admin') {
      trainerId = ctx.params.trainerId;
    }
    rsRepository = await rsRepository;
    try {
      let result = await rsRepository.getById(
        trainerId,
        'trainerPaymentDetails',
      );
      ctx.body =
        result && result.payments
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
    fetchTrainerPaymentDetails,
  };
};
