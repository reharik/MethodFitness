module.exports = function(invariant) {
  return function({
    clientId,
    source,
    startDate,
    sourceNotes,
    birthDate,
    archived,
    contact,
    clientRates,
    legacyId,
    createdDate,
    createdById,
    //TODO remove after migration
    migration,
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
    invariant(
      fullHourTenPack,
      'clientAdded requires that you pass the clients fullHourTenPack rate',
    );
    invariant(
      fullHour,
      'clientAdded requires that you pass the clients fullHour rate',
    );
    invariant(
      halfHourTenPack,
      'clientAdded requires that you pass the clients halfHourTenPack rate',
    );
    invariant(
      halfHour,
      'clientAdded requires that you pass the clients halfHour rate',
    );
    invariant(
      pairTenPack,
      'clientAdded requires that you pass the clients pairTenPack rate',
    );
    invariant(pair, 'clientAdded requires that you pass the clients pair rate');
    invariant(
      halfHourPairTenPack,
      'clientAdded requires that you pass the clients halfHourPairTenPack rate',
    );
    invariant(
      halfHourPair,
      'clientAdded requires that you pass the clients halfHourPair rate',
    );
    invariant(
      fullHourGroupTenPack,
      'clientAdded requires that you pass the clients fullHourGroupTenPack rate',
    );
    invariant(
      fullHourGroup,
      'clientAdded requires that you pass the clients fullHourGroup rate',
    );
    invariant(
      halfHourGroupTenPack,
      'clientAdded requires that you pass the clients halfHourGroupTenPack rate',
    );
    invariant(
      halfHourGroup,
      'clientAdded requires that you pass the clients halfHourGroup rate',
    );
    invariant(
      fortyFiveMinuteTenPack,
      'clientAdded requires that you pass the clients fortyFiveMinuteTenPack rate',
    );
    invariant(
      fortyFiveMinute,
      'clientAdded requires that you pass the clients fortyFiveMinute rate',
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
      //TODO remove after migration
      migration,
    };
  };
};
