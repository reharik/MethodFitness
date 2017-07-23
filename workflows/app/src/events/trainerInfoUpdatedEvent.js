module.exports = function(invariant) {
  return function({
                    id,
                    color,
                    birthDate
                  }) {
    invariant(id, 'trainerInfoUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainerInfoUpdated',
      id,
      color,
      birthDate
    };
  };
};
