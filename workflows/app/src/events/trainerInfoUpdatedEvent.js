module.exports = function(invariant) {
  return function({
                    trainerId,
                    color,
                    birthDate
                  }) {
    invariant(trainerId, 'trainerInfoUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainerInfoUpdated',
      trainerId,
      color,
      birthDate
    };
  };
};
