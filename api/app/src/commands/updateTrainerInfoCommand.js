module.exports = function(invariant) {
  return function({
                     id,
                     birthDate,
                     color
                   }) {
    invariant(id, 'updateTrainerInfo requires that you pass the trainers id');
    return {
      id,
      birthDate,
      color
    };
  };
};
