module.exports = function(moment) {
  return function() {
    return {
      healthCheck: moment().toISOString(),
    };
  };
};
