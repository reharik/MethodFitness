module.exports = function() {
  return function({ appointmentId, clients,
                    createdDate,
                    createdById }, rescheduled) {
    return {
      eventName: 'pastAppointmentRemoved',
      clients,
      appointmentId,
      rescheduled,
      createdDate,
      createdById
    };
  };
};
