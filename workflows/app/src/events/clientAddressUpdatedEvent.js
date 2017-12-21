module.exports = function(invariant) {
  return function({
    clientId,
    address
  }) {
    const {
      street1,
      street2,
      city,
      state,
      zipCode
    } = address;
    invariant(clientId, 'clientAddressUpdated requires that you pass the clients id');
    return {
      eventName: 'clientAddressUpdated',
      clientId,
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
