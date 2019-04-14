module.exports = function(invariant) {
  return function({
    clientId,
    source,
    startDate,
    sourceNotes,
    birthDate,
    archived,
    contact,
    legacyId,
                    createdDate,
                    createdById,
                    //TODO remove after migration
                    migration
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

    invariant(
      firstName,
      'clientAdded requires that you pass the clients first name',
    );
    invariant(
      lastName,
      'clientAdded requires that you pass the clients last name',
    );
    invariant(email, 'clientAdded requires that you pass the clients email');
    invariant(
      mobilePhone,
      'clientAdded requires that you pass the clients mobilePhone',
    );
    invariant(
      startDate,
      'clientAdded requires that you pass the clients startDate',
    );

    return {
      eventName: 'clientAdded',
      clientId,
      source,
      startDate,
      sourceNotes,
      birthDate,
      archived,
      legacyId,
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
      createdDate,
      createdById,
      //TODO remove after migration
      migration
    };
  };
};
