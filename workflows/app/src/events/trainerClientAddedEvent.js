module.exports = function() {
  return function({
    trainerId,
    clientId,
                    createdDate,
                    createdById
  }) {
    return {
      eventName: 'trainerClientAdded',
      trainerId,
      clientId,
      createdDate,
      createdById
    };
  };
};
