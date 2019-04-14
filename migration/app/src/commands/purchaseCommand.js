module.exports = function(invariant) {
  return function({
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
                    createdDate,
                    createdById,
                    "Half HourAppointmentIds",
                    HourAppointmentIds,
                    PairsAppointmentIds
                  }) {
    invariant(clientId, 'purchases requires that you pass the clients Id');
    return {
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
      createdDate,
      createdById,
      "Half HourAppointmentIds",
      HourAppointmentIds,
      PairsAppointmentIds,
      migration: true
    };
  };
};
