module.exports = function() {
  return function({ appointmentId }) {
    return {
      eventName: 'appointmentCanceled',
      id: appointmentId
    };
  };
};
