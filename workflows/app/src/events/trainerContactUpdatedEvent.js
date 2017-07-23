module.exports = function(invariant) {
  return function({
                    id,
                    contact
                  }) {
    const {
      secondaryPhone,
      mobilePhone,
      email,
      firstName,
      lastName} = contact;
    invariant(id, 'trainerContactUpdated requires that you pass the trainers id');
    invariant(email, 'trainerContactUpdated requires that you pass the trainers email');
    invariant(mobilePhone, 'trainerContactUpdated requires that you pass the trainers mobilePhone');
    invariant(firstName, 'trainerInfoUpdated requires that you pass the trainers first name');
    invariant(lastName, 'trainerInfoUpdated requires that you pass the trainers last name');
    return {
      eventName: 'trainerContactUpdated',
      id,
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
