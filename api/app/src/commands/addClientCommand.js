module.exports = function(invariant) {
  return function({
    source,
    startDate,
    sourceNotes,
    birthDate,
    archived,
    contact,
    legacyId,
    createdDate,
    createdById,
    clientRates,
    addClientToCreator,
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

    const {
      fullHourTenPack,
      fullHour,
      halfHourTenPack,
      halfHour,
      pairTenPack,
      pair,
      halfHourPairTenPack,
      halfHourPair,
      fullHourGroupTenPack,
      fullHourGroup,
      halfHourGroupTenPack,
      halfHourGroup,
      fortyFiveMinuteTenPack,
      fortyFiveMinute,
    } = clientRates;
    invariant(
      firstName,
      'addClient requires that you pass the clients first name',
    );
    invariant(
      lastName,
      'addClient requires that you pass the clients last name',
    );
    invariant(email, 'addClient requires that you pass the clients email');
    invariant(
      mobilePhone,
      'addClient requires that you pass the clients mobilePhone',
    );
    invariant(
      startDate,
      'addClient requires that you pass the clients startDate',
    );
    invariant(
      fullHourTenPack,
      'addClient requires that you pass the clients fullHourTenPack rate',
    );
    invariant(
      fullHour,
      'addClient requires that you pass the clients fullHour rate',
    );
    invariant(
      halfHourTenPack,
      'addClient requires that you pass the clients halfHourTenPack rate',
    );
    invariant(
      halfHour,
      'addClient requires that you pass the clients halfHour rate',
    );
    invariant(
      pairTenPack,
      'addClient requires that you pass the clients pairTenPack rate',
    );
    invariant(pair, 'addClient requires that you pass the clients pair rate');
    invariant(
      halfHourPairTenPack,
      'addClient requires that you pass the clients halfHourPairTenPack rate',
    );
    invariant(
      halfHourPair,
      'addClient requires that you pass the clients halfHourPair rate',
    );
    invariant(
      fullHourGroupTenPack,
      'addClient requires that you pass the clients fullHourGroupTenPack rate',
    );
    invariant(
      fullHourGroup,
      'addClient requires that you pass the clients fullHourGroup rate',
    );
    invariant(
      halfHourGroupTenPack,
      'addClient requires that you pass the clients halfHourGroupTenPack rate',
    );
    invariant(
      halfHourGroup,
      'addClient requires that you pass the clients halfHourGroup rate',
    );
    invariant(
      fortyFiveMinuteTenPack,
      'addClient requires that you pass the clients fortyFiveMinuteTenPack rate',
    );
    invariant(
      fortyFiveMinute,
      'addClient requires that you pass the clients fortyFiveMinute rate',
    );

    return {
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
      clientRates: {
        fullHourTenPack,
        fullHour,
        halfHourTenPack,
        halfHour,
        pairTenPack,
        pair,
        halfHourPairTenPack,
        halfHourPair,
        fullHourGroupTenPack,
        fullHourGroup,
        halfHourGroupTenPack,
        halfHourGroup,
        fortyFiveMinuteTenPack,
        fortyFiveMinute,
      },
      createdDate,
      createdById,
      addClientToCreator,
    };
  };
};
