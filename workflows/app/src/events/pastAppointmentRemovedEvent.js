module.exports = function() {
  return function({ appointmentId, clients }, rescheduled) {
    return {
      eventName: 'pastAppointmentRemoved',
      clients,
      appointmentId,
      rescheduled
    };
  };
};
