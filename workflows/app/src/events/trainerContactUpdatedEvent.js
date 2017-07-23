module.exports = function(invariant) {
  return function({
                    id,
                    secondaryPhone,
                    mobilePhone,
                    email
                  }) {
    invariant(id, 'trainerContactUpdated requires that you pass the trainers id');
    invariant(email, 'trainerContactUpdated requires that you pass the trainers email');
    invariant(mobilePhone, 'trainerContactUpdated requires that you pass the trainers mobilePhone');
    return {
      eventName: 'trainerContactUpdated',
      id,
      contact: {
        secondaryPhone,
        mobilePhone,
        email
      }
    };
  };
};
