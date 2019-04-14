module.exports = function() {
  return function({
    trainerId,
    clientId,
    rate,
                    createdDate,
                    createdById
  }) {
    return {
      eventName: 'trainersNewClientRateSet',
      trainerId,
      clientId,
      rate,
      createdDate,
      createdById
    };
  };
};
