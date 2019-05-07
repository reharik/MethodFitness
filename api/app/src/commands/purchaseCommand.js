module.exports = function(invariant) {
  return function({
    clientId,
    fullHour,
    fullHourTenPack,
    halfHour,
    halfHourTenPack,
    pair,
    pairTenPack,
    halfHourPair,
    halfHourPairTenPack,
    fullHourGroup,
    fullHourGroupTenPack,
    halfHourGroup,
    halfHourGroupTenPack,
    fortyFiveMinute,
    fortyFiveMinuteTenPack,
    notes,
    // this is just for migration
    fullHourPrice,
    fullHourTenPackPrice,
    halfHourPrice,
    halfHourTenPackPrice,
    pairPrice,
    pairTenPackPrice,
    halfHourPairPrice,
    halfHourPairTenPackPrice,
    fullHourGroupPrice,
    fullHourGroupTenPackPrice,
    halfHourGroupPrice,
    halfHourGroupTenPackPrice,
    fortyFiveMinutePrice,
    fortyFiveMinuteTenPackPrice,
    purchaseTotal,
    createdDate,
    createdById,
  }) {
    invariant(clientId, 'purchases requires that you pass the clients Id');
    invariant(
      fullHour ||
        fullHourTenPack ||
        halfHour ||
        halfHourTenPack ||
        pair ||
        pairTenPack ||
        halfHourPair ||
        halfHourPairTenPack ||
        fullHourGroup ||
        fullHourGroupTenPack ||
        halfHourGroup ||
        halfHourGroupTenPack ||
        fortyFiveMinute ||
        fortyFiveMinuteTenPack,
      'purchases requires that purchase at least one session',
    );
    return {
      clientId,
      fullHour,
      fullHourTenPack,
      halfHour,
      halfHourTenPack,
      pair,
      pairTenPack,
      halfHourPair,
      halfHourPairTenPack,
      fullHourGroup,
      fullHourGroupTenPack,
      halfHourGroup,
      halfHourGroupTenPack,
      fortyFiveMinute,
      fortyFiveMinuteTenPack,
      notes,
      // this is just for migration
      fullHourPrice,
      fullHourTenPackPrice,
      halfHourPrice,
      halfHourTenPackPrice,
      pairPrice,
      pairTenPackPrice,
      halfHourPairPrice,
      halfHourPairTenPackPrice,
      fullHourGroupPrice,
      fullHourGroupTenPackPrice,
      halfHourGroupPrice,
      halfHourGroupTenPackPrice,
      fortyFiveMinutePrice,
      fortyFiveMinuteTenPackPrice,
      purchaseTotal,
      createdDate,
      createdById,
    };
  };
};
