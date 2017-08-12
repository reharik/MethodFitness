module.exports = function(invariant) {
  return function({ id, password, role }) {
    invariant(id, 'updateTrainerInfo requires that you pass the trainers id');
    return {
      id,
      credentials: {
        password,
        role
      }
    };
  };
};
