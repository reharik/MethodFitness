module.exports = function() {
  return function({ appointmentId, clients }, rescheduled) {
    const event = {
      eventName: 'pastAppointmentRemoved',
      clients,
      appointmentId
    };
    if (rescheduled) {
      event.rescheduled = true;
    }
    return event;
  };
};
