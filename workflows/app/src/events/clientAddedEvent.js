module.exports = function(invariant) {
  return function({id,
                    source,
                    startDate,
                    sourceNotes,
                    birthDate,
                    archived,
                    contact
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

    invariant(firstName, 'clientAdded requires that you pass the clients first name');
    invariant(lastName, 'clientAdded requires that you pass the clients last name');
    invariant(email, 'clientAdded requires that you pass the clients email');
    invariant(mobilePhone, 'clientAdded requires that you pass the clients mobilePhone');
    invariant(startDate, 'clientAdded requires that you pass the clients startDate');

    return {
      eventName: 'clientAdded',
      id,
      source,
      startDate,
      sourceNotes,
      birthDate,
      archived,
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
      }
    };
  };
};
