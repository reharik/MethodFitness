module.exports = function(invariant) {
  return function({
    clientId,
    firstName,
    lastName,
    birthDate,
                    createdDate,
                    createdById
  }) {
    invariant(clientId, 'clientInfoUpdated requires that you pass the client id');
    invariant(firstName, 'clientInfoUpdated requires that you pass the client first name');
    invariant(lastName, 'clientInfoUpdated requires that you pass the client last name');
    return {
      eventName: 'clientInfoUpdated',
      clientId,
      firstName,
      lastName,
      birthDate,
      createdDate,
      createdById
    };
  };
};
