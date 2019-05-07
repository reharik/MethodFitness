module.exports = function() {
  return function({ appointmentId, createdDate, createdById }) {
    return {
      eventName: 'appointmentCanceled',
      appointmentId,
      createdDate,
      createdById,
    };
  };
};
