module.exports = function(invariant) {
  return function({
    defaultClientRatesId,

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
      fullHourTenPack,
      'defaultClientRatesUpdated requires that you pass the clients fullHourTenPack rate',
    );
    invariant(
      fullHour,
      'defaultClientRatesUpdated requires that you pass the clients fullHour rate',
    );
    invariant(
      halfHourTenPack,
      'defaultClientRatesUpdated requires that you pass the clients halfHourTenPack rate',
    );
    invariant(
      halfHour,
      'defaultClientRatesUpdated requires that you pass the clients halfHour rate',
    );
    invariant(
      pairTenPack,
      'defaultClientRatesUpdated requires that you pass the clients pairTenPack rate',
    );
    invariant(
      pair,
      'defaultClientRatesUpdated requires that you pass the clients pair rate',
    );
    invariant(
      halfHourPairTenPack,
      'defaultClientRatesUpdated requires that you pass the clients halfHourPairTenPack rate',
    );
    invariant(
      halfHourPair,
      'defaultClientRatesUpdated requires that you pass the clients halfHourPair rate',
    );
    invariant(
      fullHourGroupTenPack,
      'defaultClientRatesUpdated requires that you pass the clients fullHourGroupTenPack rate',
    );
    invariant(
      fullHourGroup,
      'defaultClientRatesUpdated requires that you pass the clients fullHourGroup rate',
    );
    invariant(
      halfHourGroupTenPack,
      'defaultClientRatesUpdated requires that you pass the clients halfHourGroupTenPack rate',
    );
    invariant(
      halfHourGroup,
      'defaultClientRatesUpdated requires that you pass the clients halfHourGroup rate',
    );
    invariant(
      fortyFiveMinuteTenPack,
      'defaultClientRatesUpdated requires that you pass the clients fortyFiveMinuteTenPack rate',
    );
    invariant(
      fortyFiveMinute,
      'defaultClientRatesUpdated requires that you pass the clients fortyFiveMinute rate',
    );
    return {
      eventName: 'defaultClientRatesUpdated',
      defaultClientRatesId,
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
    };
  };
};
