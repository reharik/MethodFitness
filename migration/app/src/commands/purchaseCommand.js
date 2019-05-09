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
                    purchaseTotal,
                    createdDate,
                    createdById,
                    // this is just for migration
                    fullHourAppointmentIds,
                    fullHourTenPackAppointmentIds,
                    halfHourAppointmentIds,
                    halfHourTenPackAppointmentIds,
                    pairAppointmentIds,
                    pairTenPackAppointmentIds,
                    halfHourPairAppointmentIds,
                    halfHourPairTenPackAppointmentIds,
                    fullHourGroupAppointmentIds,
                    fullHourGroupTenPackAppointmentIds,
                    halfHourGroupAppointmentIds,
                    halfHourGroupTenPackAppointmentIds,
                    fortyFiveMinuteAppointmentIds,
                    fortyFiveMinuteTenPackAppointmentIds,
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
      fullHourAppointmentIds,
      halfHourAppointmentIds,
      pairAppointmentIds,
      halfHourPairAppointmentIds,
      fullHourGroupAppointmentIds,
      halfHourGroupAppointmentIds,
      fortyFiveMinuteAppointmentIds,
      purchaseTotal,
      createdDate,
      createdById,
      migration: true
    };
  };
};
