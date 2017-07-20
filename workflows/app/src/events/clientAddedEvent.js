module.exports = function({}) {
  return function({trainerId, paidAppointments, paymentTotal, datePaid}) {
    invariant(trainerId, 'payTrainer requires that you pass the trainers id');
    invariant(datePaid, 'payTrainer requires that you pass the date of payment');
    invariant(paymentTotal && paymentTotal > 0, 'payTrainer requires that you pass a payment total greater than 0');
    invariant(paidAppointments, 'payTrainer requires that you pass the session ids');
    invariant(paidAppointments.length > 0, 'payTrainer requires that you pass at least one session id');
    return {trainerId, paidAppointments, paymentTotal, datePaid};
  };
};
