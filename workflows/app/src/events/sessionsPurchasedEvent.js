module.exports = function(invariant) {
  return function({
    purchaseId,
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
    notes,
    purchaseTotal,
    sessions,
    createdDate,
    createdById,
    //TODO remove after migration
    migration,
  }) {
    invariant(
      clientId,
      'sessionsPurchased requires that you pass the clients Id',
    );
    invariant(purchaseId, 'sessionsPurchased requires that you pass the Id');
    sessions.forEach(s => {
      invariant(
        s.clientId,
        'A session purchased requires you pass the client id',
      );
      invariant(
        s.sessionId,
        'A session purchased requires you pass the session id',
      );
      invariant(
        s.appointmentType,
        'A session purchased requires you pass the appointment type',
      );
      invariant(
        s.purchaseId,
        'A session purchased requires you pass the purchase id',
      );
      invariant(
        s.purchasePrice,
        'A session purchased requires you pass the purchase price',
      );
      invariant(
        s.createdDate,
        'A session purchased requires you pass the date',
      );
    });
    return {
      eventName: 'sessionsPurchased',
      purchaseId,
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
      notes,
      purchaseTotal,
      sessions,
      createdDate,
      createdById,
      purchaseDate: createdDate,
      //TODO remove after migration
      migration,
    };
  };
};
