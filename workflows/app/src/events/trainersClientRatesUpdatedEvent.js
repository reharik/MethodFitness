module.exports = function() {
  return function({ trainerId, clientId, rate, createdDate, createdById }) {
    return {
      eventName: 'trainersClientRateChanged',
      trainerId,
      clientId,
      rate,
      createdDate,
      createdById,
    };
  };
};
