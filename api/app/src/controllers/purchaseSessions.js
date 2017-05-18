module.exports = function(invariant) {
  return function (data) {
    invariant(data.clientId, 'purchases requires that you pass the clients Id');
    invariant(data.fullHour
      || data.fullHour
      || data.fullHourTenPack
      || data.halfHour
      || data.halfHourTenPack
      || data.pair
      || data.pairTenPack
      , 'purchases requires purchase at least one session');
    return data;
  };
};