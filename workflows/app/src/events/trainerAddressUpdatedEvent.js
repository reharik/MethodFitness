module.exports = function(invariant) {
  return function({
                    id,
                    street1,
                    street2,
                    city,
                    state,
                    zipCode
                  }) {
    invariant(id, 'trainerAddressUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainerAddressUpdated',
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
