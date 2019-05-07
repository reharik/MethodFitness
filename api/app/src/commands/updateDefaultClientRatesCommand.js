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
      defaultClientRatesId,
      'updateDefaultClientRates requires that you pass the defaultClientRatesId',
    );
    invariant(
      fullHourTenPack,
      'updateDefaultClientRates requires that you pass the default fullHourTenPack rate',
    );
    invariant(
      fullHour,
      'updateDefaultClientRates requires that you pass the default fullHour rate',
    );
    invariant(
      halfHourTenPack,
      'updateDefaultClientRates requires that you pass the default halfHourTenPack rate',
    );
    invariant(
      halfHour,
      'updateDefaultClientRates requires that you pass the default halfHour rate',
    );
    invariant(
      pairTenPack,
      'updateDefaultClientRates requires that you pass the default pairTenPack rate',
    );
    invariant(
      pair,
      'updateDefaultClientRates requires that you pass the default pair rate',
    );
    invariant(
      halfHourPairTenPack,
      'updateDefaultClientRates requires that you pass the default halfHourPairTenPack rate',
    );
    invariant(
      halfHourPair,
      'updateDefaultClientRates requires that you pass the default halfHourPair rate',
    );
    invariant(
      fullHourGroupTenPack,
      'updateDefaultClientRates requires that you pass the default fullHourGroupTenPack rate',
    );
    invariant(
      fullHourGroup,
      'updateDefaultClientRates requires that you pass the default fullHourGroup rate',
    );
    invariant(
      halfHourGroupTenPack,
      'updateDefaultClientRates requires that you pass the default halfHourGroupTenPack rate',
    );
    invariant(
      halfHourGroup,
      'updateDefaultClientRates requires that you pass the default halfHourGroup rate',
    );
    invariant(
      fortyFiveMinuteTenPack,
      'updateDefaultClientRates requires that you pass the default fortyFiveMinuteTenPack rate',
    );
    invariant(
      fortyFiveMinute,
      'updateDefaultClientRates requires that you pass the default fortyFiveMinute rate',
    );
    return {
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
