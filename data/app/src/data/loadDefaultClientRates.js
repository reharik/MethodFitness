module.exports = function(uuid, invariant) {
  return {
    defaultClientRates: {
      defaultClientRatesId: '23407924-a855-4f1b-b4f4-5a3e82ed7543',
      fullHour: 65,
      fullHourTenPack: 600,
      halfHour: 38,
      halfHourTenPack: 350,
      pair: 45,
      pairTenPack: 400,
      halfHourPair: 30,
      halfHourPairTenPack: 250,
      fullHourGroup: 25,
      fullHourGroupTenPack: 200,
      halfHourGroup: 40,
      halfHourGroupTenPack: 350,
      fortyFiveMinute: 42,
      fortyFiveMinuteTenPack: 400,
    },

    addDefaultClientRates: _defaultClientRates => {
      invariant(
        _defaultClientRates.fullHourTenPack,
        'updateDefaultClientRates requires that you pass the default fullHourTenPack rate',
      );
      invariant(
        _defaultClientRates.fullHour,
        'updateDefaultClientRates requires that you pass the default fullHour rate',
      );
      invariant(
        _defaultClientRates.halfHourTenPack,
        'updateDefaultClientRates requires that you pass the default halfHourTenPack rate',
      );
      invariant(
        _defaultClientRates.halfHour,
        'updateDefaultClientRates requires that you pass the default halfHour rate',
      );
      invariant(
        _defaultClientRates.pairTenPack,
        'updateDefaultClientRates requires that you pass the default pairTenPack rate',
      );
      invariant(
        _defaultClientRates.pair,
        'updateDefaultClientRates requires that you pass the default pair rate',
      );
      invariant(
        _defaultClientRates.halfHourPairTenPack,
        'updateDefaultClientRates requires that you pass the default halfHourPairTenPack rate',
      );
      invariant(
        _defaultClientRates.halfHourPair,
        'updateDefaultClientRates requires that you pass the default halfHourPair rate',
      );
      invariant(
        _defaultClientRates.fullHourGroupTenPack,
        'updateDefaultClientRates requires that you pass the default fullHourGroupTenPack rate',
      );
      invariant(
        _defaultClientRates.fullHourGroup,
        'updateDefaultClientRates requires that you pass the default fullHourGroup rate',
      );
      invariant(
        _defaultClientRates.halfHourGroupTenPack,
        'updateDefaultClientRates requires that you pass the default halfHourGroupTenPack rate',
      );
      invariant(
        _defaultClientRates.halfHourGroup,
        'updateDefaultClientRates requires that you pass the default halfHourGroup rate',
      );
      invariant(
        _defaultClientRates.fortyFiveMinuteTenPack,
        'updateDefaultClientRates requires that you pass the default fortyFiveMinuteTenPack rate',
      );
      invariant(
        _defaultClientRates.fortyFiveMinute,
        'updateDefaultClientRates requires that you pass the default fortyFiveMinute rate',
      );
      return _defaultClientRates;
    },
  };
};
