module.exports = function(invariant) {
  return function({ trainerId,
    color,
    birthDate,
    archived,
    contact,
    credentials,
    clients
  }) {
    const {
      firstName,
      lastName,
      address,
      secondaryPhone,
      mobilePhone,
      email
    } = contact;
    const {
      street1,
      street2,
      city,
      state,
      zipCode
    } = address;
    const {
      password,
      role
    } = credentials;

    invariant(firstName, 'trainerHired requires that you pass the trainers first name');
    invariant(lastName, 'trainerHired requires that you pass the trainers last name');
    // invariant(email, 'trainerHired requires that you pass the trainers email');
    // invariant(mobilePhone, 'trainerHired requires that you pass the trainers mobilePhone');
    // invariant(password, 'trainerHired requires that you pass the trainers password');
    invariant(role, 'trainerHired requires that you pass the trainers role');

    return {
      eventName: 'trainerHired',
      trainerId,
      color,
      birthDate,
      archived,
      clients,
      contact: {
        firstName,
        lastName,
        secondaryPhone,
        mobilePhone,
        email,
        address: {
          street1,
          street2,
          city,
          state,
          zipCode
        }
      },
      credentials: {
        password,
        role
      }
    };
  };
};
