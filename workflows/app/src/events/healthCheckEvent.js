module.exports = function(invariant) {
  return function({ healthCheck, healthCheckId, createdDate, createdById }) {
    invariant(
      healthCheck,
      'healthCheck requires that you pass the date for the health check',
    );
    invariant(
      healthCheckId,
      'healthCheck requires that you pass the id for the health check',
    );
    return {
      eventName: 'healthCheck',
      healthCheck,
      healthCheckId,
      createdDate,
      createdById,
    };
  };
};
