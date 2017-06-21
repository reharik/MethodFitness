module.exports = function(invariant) {
  return function({trainerId, paidAppointments, datePaid}) {
    invariant(trainerId, 'payTrainer requires that you pass the trainers id');
    invariant(datePaid, 'payTrainer requires that you pass the date of payment');
    invariant(paidAppointments, 'payTrainer requires that you pass the session ids');
    invariant(paidAppointments.length > 0, 'payTrainer requires that you pass at least one session id');
    return {trainerId, paidAppointments, datePaid};
  };
};
