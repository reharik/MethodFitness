module.exports = function(invariant) {
  return function({ id, credentials }) {
    const { password } = credentials;
    invariant(id, 'trainerPasswordUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainerPasswordUpdated',
      id,
      credentials: {
        password
      }
    };
  };
};
