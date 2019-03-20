module.exports = function(invariant) {
  return function({
    birthDate,
    archived,
    contact,
    credentials,
    clients,
    defaultTrainerClientRate,
    color,
  }) {
    const {
      firstName,
      lastName,
      address,
      secondaryPhone,
      mobilePhone,
      email,
    } = contact;
    const { street1, street2, city, state, zipCode } = address;
    const { password, role } = credentials;

    invariant(
      firstName,
      'hireTrainer requires that you pass the trainers first name',
    );
    invariant(
      lastName,
      'hireTrainer requires that you pass the trainers last name',
    );
    invariant(email, 'hireTrainer requires that you pass the trainers email');
    invariant(
      mobilePhone,
      'hireTrainer requires that you pass the trainers mobilePhone',
    );
    invariant(
      password,
      'hireTrainer requires that you pass the trainers password',
    );
    invariant(role, 'hireTrainer requires that you pass the trainers role');
    invariant(defaultTrainerClientRate, 'hireTrainer requires that you pass the default trainer client rated');

    return {
      birthDate,
      archived,
      clients,
      defaultTrainerClientRate,
      color,
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
          zipCode,
        },
      },
      credentials: {
        password,
        role,
      },
    };
  };
};
