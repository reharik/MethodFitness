module.exports = function(invariant) {
  return function({
                     source,
                     startDate,
                     sourceNotes,
                     birthDate,
                     archived,
                     contact,
                    id,
                    migrationId
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

    invariant(firstName, 'addClient requires that you pass the clients first name');
    invariant(lastName, 'addClient requires that you pass the clients last name');
    invariant(email, 'addClient requires that you pass the clients email');
    invariant(mobilePhone, 'addClient requires that you pass the clients mobilePhone');
    invariant(startDate, 'addClient requires that you pass the clients startDate');

    return {
      commandName: 'addClient',
      id,
      migrationId,
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
