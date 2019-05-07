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
      'updateClientRatesrequires that you pass the clients id',
    );
    invariant(
      fullHourTenPack,
      'updateClientRates requires that you pass the clients fullHourTenPack rate',
    );
    invariant(
      fullHour,
      'updateClientRates requires that you pass the clients fullHour rate',
    );
    invariant(
      halfHourTenPack,
      'updateClientRates requires that you pass the clients halfHourTenPack rate',
    );
    invariant(
      halfHour,
      'updateClientRates requires that you pass the clients halfHour rate',
    );
    invariant(
      pairTenPack,
      'updateClientRates requires that you pass the clients pairTenPack rate',
    );
    invariant(
      pair,
      'updateClientRates requires that you pass the clients pair rate',
    );
    invariant(
      halfHourPairTenPack,
      'updateClientRates requires that you pass the clients halfHourPairTenPack rate',
    );
    invariant(
      halfHourPair,
      'updateClientRates requires that you pass the clients halfHourPair rate',
    );
    invariant(
      fullHourGroupTenPack,
      'updateClientRates requires that you pass the clients fullHourGroupTenPack rate',
    );
    invariant(
      fullHourGroup,
      'updateClientRates requires that you pass the clients fullHourGroup rate',
    );
    invariant(
      halfHourGroupTenPack,
      'updateClientRates requires that you pass the clients halfHourGroupTenPack rate',
    );
    invariant(
      halfHourGroup,
      'updateClientRates requires that you pass the clients halfHourGroup rate',
    );
    invariant(
      fortyFiveMinuteTenPack,
      'updateClientRates requires that you pass the clients fortyFiveMinuteTenPack rate',
    );
    invariant(
      fortyFiveMinute,
      'updateClientRates requires that you pass the clients fortyFiveMinute rate',
    );
    return {
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
    };
  };
};
