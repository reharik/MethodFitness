module.exports = function(invariant) {
  return function({trainerId, sessionIds, datePaid}) {
    invariant(trainerId, 'payTrainer requires that you pass the trainers id');
    invariant(datePaid, 'payTrainer requires that you pass the date of payment');
    invariant(sessionIds, 'payTrainer requires that you pass the session ids');
    invariant(sessionIds.length > 0, 'payTrainer requires that you pass at least one session id');
    return {trainerId, sessionIds, datePaid};
  };
};
