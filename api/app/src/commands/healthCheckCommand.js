module.exports = function(moment) {
  return function(healthCheckId, createdDate, createdById) {
    return {
      healthCheckId,
      healthCheck: moment().toISOString(),
      createdDate,
      createdById,
    };
  };
};
