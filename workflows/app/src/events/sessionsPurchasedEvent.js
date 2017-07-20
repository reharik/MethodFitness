module.exports = function(invariant) {
  return function({id,
                    clientId,
                    fullHour,
                    fullHourTenPack,
                    halfHour,
                    halfHourTenPack,
                    pair,
                    pairTenPack,
                    notes,
                    fullHourTotal,
                    fullHourTenPackTotal,
                    halfHourTotal,
                    halfHourTenPackTotal,
                    pairTotal,
                    pairTenPackTotal,
                    purchaseTotal,
                    totalFullHours,
                    totalHalfHours,
                    totalPairs,
                    createDate,
                   sessions
                  }) {

    invariant(clientId, 'sessionsPurchased requires that you pass the clients Id');
    invariant(id, 'sessionsPurchased requires that you pass the Id');
    sessions.forEach(s => {
      invariant(s.clientId, 'A session purchased requires you pass the client id');
      invariant(s.sessionId, 'A session purchased requires you pass the session id');
      invariant(s.appointmentType, 'A session purchased requires you pass the appointment type');
      invariant(s.purchaseId, 'A session purchased requires you pass the purchase id');
      invariant(s.purchasePrice, 'A session purchased requires you pass the purchase price');
      invariant(s.createdDate, 'A session purchased requires you pass the date');
    });
    return {
      eventName: 'sessionsPurchased',
      id,
      clientId,
      fullHour,
      fullHourTenPack,
      halfHour,
      halfHourTenPack,
      pair,
      pairTenPack,
      notes,
      fullHourTotal,
      fullHourTenPackTotal,
      halfHourTotal,
      halfHourTenPackTotal,
      pairTotal,
      pairTenPackTotal,
      purchaseTotal,
      totalFullHours,
      totalHalfHours,
      totalPairs,
      purchaseDate: createDate,
      sessions
    };
  };
};
