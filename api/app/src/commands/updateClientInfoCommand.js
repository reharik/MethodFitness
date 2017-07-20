module.exports = function(invariant) {
  return function({
                     id,
                     firstName,
                     lastName,
                     birthDate
                   }) {
    invariant(id, 'updateClientInfo requires that you pass the trainers id');
    invariant(firstName, 'updateClientInfo requires that you pass the trainers first name');
    invariant(lastName, 'updateClientInfo requires that you pass the trainers last name');
    return {
      id,
      firstName,
      lastName,
      birthDate
    };
  };
};
