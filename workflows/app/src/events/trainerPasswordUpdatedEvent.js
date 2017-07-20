module.exports = function(invariant) {
  return function({ id, password }) {
    invariant(id, 'trainerPasswordUpdated requires that you pass the trainers id');
    return {
      id,
      credentials: {
        password
      }
    };
  };
};
