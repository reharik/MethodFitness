module.exports = function() {
  return function({ trainerId, clientId, createdDate, createdById }) {
    return {
      eventName: 'trainerClientRemoved',
      trainerId,
      clientId,
      createdDate,
      createdById,
    };
  };
};
