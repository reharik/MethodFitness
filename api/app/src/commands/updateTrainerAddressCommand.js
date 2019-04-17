module.exports = function(invariant) {
  return function({
                     trainerId,
                     street1,
                     street2,
                     city,
                     state,
                     zipCode,
                    createdDate,
                    createdById
                  }) {
    invariant(trainerId, 'updateTrainerAddress requires that you pass the trainers id');
    return {
      trainerId,
      address: {
        street1,
        street2,
        city,
        state,
        zipCode,
        createdDate,
        createdById
      }
    };
  };
};
