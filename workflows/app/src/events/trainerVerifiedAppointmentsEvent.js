module.exports = function(invariant) {
  return function({trainerId, sessionIds, verifiedDate,
                    createdDate,
                    createdById,
                    //TODO remove after migration
                    migration
  }) {
    invariant(trainerId, 'trainerVerifiedAppointments requires that you pass the trainers id');
    invariant(verifiedDate, 'verifyAppointments requires that you pass the verified date');
    invariant(sessionIds, 'verifyAppointments requires that you pass the session ids');
    invariant(sessionIds.length > 0, 'verifyAppointments requires that you pass at least one session id');
    return {
      eventName: 'trainerVerifiedAppointments',
      trainerId, sessionIds, verifiedDate,
      createdDate,
      createdById,
      //TODO remove after migration
      migration
    };
  };
};
