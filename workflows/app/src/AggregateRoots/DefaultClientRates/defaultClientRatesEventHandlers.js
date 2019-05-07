module.exports = function() {
  return state => {
    return {
      defaultClientRatesUpdated: event => {
        state._id = event.defaultClientRatesId;
        state.fullHourTenPack = event.fullHourTenPack;
        state.fullHour = event.fullHour;
        state.halfHourTenPack = event.halfHourTenPack;
        state.halfHour = event.halfHour;
        state.pairTenPack = event.pairTenPack;
        state.pair = event.pair;
        state.halfHourPairTenPack = event.halfHourPairTenPack;
        state.halfHourPair = event.halfHourPair;
        state.fullHourGroupTenPack = event.fullHourGroupTenPack;
        state.fullHourGroup = event.fullHourGroup;
        state.halfHourGroupTenPack = event.halfHourGroupTenPack;
        state.halfHourGroup = event.halfHourGroup;
        state.fortyFiveMinuteTenPack = event.fortyFiveMinuteTenPack;
        state.fortyFiveMinute = event.fortyFiveMinute;
      },
    };
  };
};
