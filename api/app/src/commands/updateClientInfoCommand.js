module.exports = function(invariant) {
  return function({
                     clientId,
                     firstName,
                     lastName,
                     birthDate
                   }) {
    invariant(clientId, 'updateClientInfo requires that you pass the trainers id');
    invariant(firstName, 'updateClientInfo requires that you pass the trainers first name');
    invariant(lastName, 'updateClientInfo requires that you pass the trainers last name');
    return {
      clientId,
      firstName,
      lastName,
      birthDate
    };
  };
};
