module.exports = function() {
  return function({
    trainerId,
    clientId
  }) {
    return {
      eventName: 'trainerClientAdded',
      trainerId,
      clientId
    };
  };
};
