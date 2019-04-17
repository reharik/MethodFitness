module.exports = function(invariant) {
  return function({ trainerId, password, role }) {
    invariant(
      trainerId,
      'updateTrainerPassword requires that you pass the trainers id',
    );
    return {
      trainerId,
      credentials: {
        password,
        role,
      },
    };
  };
};
