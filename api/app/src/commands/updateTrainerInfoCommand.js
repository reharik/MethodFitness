module.exports = function(invariant) {
  return function({
                     trainerId,
                     birthDate,
                     color,
                    createdDate,
                    createdById
                  }) {
    invariant(trainerId, 'updateTrainerInfo requires that you pass the trainers id');
    return {
      trainerId,
      birthDate,
      color,
      createdDate,
      createdById
    };
  };
};
