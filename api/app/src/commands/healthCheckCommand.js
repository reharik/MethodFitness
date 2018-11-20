module.exports = function(moment) {
  return function(healthCheckId) {
    return {
      healthCheckId,
      healthCheck: moment().toISOString(),
    };
  };
};
