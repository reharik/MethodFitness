module.exports = function() {
  return function({ appointmentId, clients }) {
    return {
      eventName: 'pastAppointmentRemoved',
      clients,
      id: appointmentId
    };
  };
};
