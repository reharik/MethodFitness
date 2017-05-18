module.exports = function(invariant) {
  return function ({
    id,
    street1,
    street2,
    city,
    state,
    zipCode
  }) {
    invariant(id, 'updateClientAddress requires that you pass the clients id');
    return {
      id,
      address: {
        street1,
        street2,
        city,
        state,
        zipCode
      }
    }
  };
};