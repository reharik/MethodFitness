module.exports = function(invariant) {
  return function ({
    id,
    birthDate,
    color,
    firstName,
    lastName,
  }) {
    invariant(id, 'updateTrainerInfo requires that you pass the trainers id');
    invariant(firstName, 'updateTrainerInfo requires that you pass the trainers first name');
    invariant(lastName, 'updateTrainerInfo requires that you pass the trainers last name');
    return {
      id,
      firstName,
      lastName,
      birthDate,
      color,
    }
  };
}