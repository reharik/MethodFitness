module.exports = function(invariant) {
  return function({
                    id,
                    street1,
                    street2,
                    city,
                    state,
                    zipCode
                  }) {
    invariant(id, 'clientAddressUpdated requires that you pass the clients id');
    return {
      eventName: 'clientAddressUpdated',
      id,
      address: {
        street1,
        street2,
        city,
        state,
        zipCode
      }
    };
  };
};
