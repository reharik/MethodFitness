module.exports = function(invariant) {
  return function({
                    id,
                    firstName,
                    lastName,
                    color,
                    birthDate
                  }) {
    invariant(id, 'trainerInfoUpdated requires that you pass the trainers id');
    invariant(firstName, 'trainerInfoUpdated requires that you pass the trainers first name');
    invariant(lastName, 'trainerInfoUpdated requires that you pass the trainers last name');
    return {
      eventName: 'trainerInfoUpdated',
      id,
      firstName,
      lastName,
      color,
      birthDate
    };
  };
};
