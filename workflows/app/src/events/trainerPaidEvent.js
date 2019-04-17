module.exports = function(invariant) {
  return function({
    paymentId,
    trainerId,
    paidAppointments,
    paymentTotal,
    datePaid,
  }) {
    invariant(paymentId, 'trainerPaid requires that you pass the payment id');
    invariant(trainerId, 'trainerPaid requires that you pass the trainers id');
    invariant(
      datePaid,
      'trainerPaid requires that you pass the date of payment',
    );
    invariant(
      paymentTotal && paymentTotal > 0,
      'trainerPaid requires that you pass a payment total greater than 0',
    );
    invariant(
      paidAppointments,
      'trainerPaid requires that you pass the session ids',
    );
    invariant(
      paidAppointments.length > 0,
      'trainerPaid requires that you pass at least one session id',
    );
    return {
      eventName: 'trainerPaid',
      paymentId,
      trainerId,
      paidAppointments,
      paymentTotal,
      datePaid,
    };
  };
};
