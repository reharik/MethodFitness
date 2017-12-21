module.exports = function(invariant) {
  return function({
    trainerId,
    address
  }) {
    const {
      street1,
      street2,
      city,
      state,
      zipCode
    } = address;
    invariant(trainerId, 'trainerAddressUpdated requires that you pass the trainers id');
    return {
      eventName: 'trainerAddressUpdated',
      trainerId,
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
