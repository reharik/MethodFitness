module.exports = function(invariant) {
  return function({
                    id,
                    firstName,
                    lastName,
                    birthDate
                  }) {
    invariant(id, 'clientInfoUpdated requires that you pass the trainers id');
    invariant(firstName, 'clientInfoUpdated requires that you pass the trainers first name');
    invariant(lastName, 'clientInfoUpdated requires that you pass the trainers last name');
    return {
      eventName: 'clientInfoUpdated',
      id,
      firstName,
      lastName,
      birthDate
    };
  };
};
