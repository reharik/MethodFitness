module.exports = function(invariant) {
  return function({ clientId, street1, street2, city, state, zipCode }) {
    invariant(
      clientId,
      'updateClientAddress requires that you pass the clients Id',
    );
    return {
      clientId,
      address: {
        street1,
        street2,
        city,
        state,
        zipCode,
      },
    };
  };
};
