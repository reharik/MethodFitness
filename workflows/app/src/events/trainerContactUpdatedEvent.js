module.exports = function(invariant) {
  return function({
                    trainerId,
                    contact
                  }) {
    const {
      secondaryPhone,
      mobilePhone,
      email,
      firstName,
      lastName} = contact;
    invariant(trainerId, 'trainerContactUpdated requires that you pass the trainers id');
    invariant(email, 'trainerContactUpdated requires that you pass the trainers email');
    invariant(mobilePhone, 'trainerContactUpdated requires that you pass the trainers mobilePhone');
    invariant(firstName, 'trainerInfoUpdated requires that you pass the trainers first name');
    invariant(lastName, 'trainerInfoUpdated requires that you pass the trainers last name');
    return {
      eventName: 'trainerContactUpdated',
      trainerId,
      contact: {
        secondaryPhone,
        mobilePhone,
        email,
        firstName,
        lastName
      }
    };
  };
};
