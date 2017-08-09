module.exports = function(invariant) {
  return function({
                    id,
                    address
                  }) {
    const {
      street1,
      street2,
      city,
      state,
      zipCode
    } = address;
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
