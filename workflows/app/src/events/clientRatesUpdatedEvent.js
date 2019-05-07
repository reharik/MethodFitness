module.exports = function(invariant) {
  return function({
    clientId,
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
    createdDate,
    createdById,
  }) {
    invariant(
      clientId,
      'clientRatesUpdatedrequires that you pass the clients id',
    );
    invariant(
      fullHourTenPack,
      'clientRatesUpdated requires that you pass the clients fullHourTenPack rate',
    );
    invariant(
      fullHour,
      'clientRatesUpdated requires that you pass the clients fullHour rate',
    );
    invariant(
      halfHourTenPack,
      'clientRatesUpdated requires that you pass the clients halfHourTenPack rate',
    );
    invariant(
      halfHour,
      'clientRatesUpdated requires that you pass the clients halfHour rate',
    );
    invariant(
      pairTenPack,
      'clientRatesUpdated requires that you pass the clients pairTenPack rate',
    );
    invariant(
      pair,
      'clientRatesUpdated requires that you pass the clients pair rate',
    );
    invariant(
      halfHourPairTenPack,
      'clientRatesUpdated requires that you pass the clients halfHourPairTenPack rate',
    );
    invariant(
      halfHourPair,
      'clientRatesUpdated requires that you pass the clients halfHourPair rate',
    );
    invariant(
      fullHourGroupTenPack,
      'clientRatesUpdated requires that you pass the clients fullHourGroupTenPack rate',
    );
    invariant(
      fullHourGroup,
      'clientRatesUpdated requires that you pass the clients fullHourGroup rate',
    );
    invariant(
      halfHourGroupTenPack,
      'clientRatesUpdated requires that you pass the clients halfHourGroupTenPack rate',
    );
    invariant(
      halfHourGroup,
      'clientRatesUpdated requires that you pass the clients halfHourGroup rate',
    );
    invariant(
      fortyFiveMinuteTenPack,
      'clientRatesUpdated requires that you pass the clients fortyFiveMinuteTenPack rate',
    );
    invariant(
      fortyFiveMinute,
      'clientRatesUpdated requires that you pass the clients fortyFiveMinute rate',
    );
    return {
      eventName: 'clientRatesUpdated',
      clientId,
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
    };
  };
};
