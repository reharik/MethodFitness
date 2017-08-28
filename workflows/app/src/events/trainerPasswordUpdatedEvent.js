module.exports = function(invariant) {
  return function({ trainerId, credentials }) {
    const { password, role } = credentials;
    invariant(trainerId, 'trainerPasswordUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainerPasswordUpdated',
      trainerId,
      credentials: {
        password,
        role
      }
    };
  };
};
