module.exports = function() {
  return function({
    trainerId,
    clientId
  }) {
    return {
      eventName: 'trainerClientRemoved',
      trainerId,
      clientId
    };
  };
};
