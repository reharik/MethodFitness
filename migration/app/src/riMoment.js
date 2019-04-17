module.exports = function(moment) {
  return function riMoment(mom) {
    return moment(mom).tz('America/New_York');
  };
};
