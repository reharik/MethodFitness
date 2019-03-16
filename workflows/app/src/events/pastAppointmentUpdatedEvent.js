module.exports = function() {
  return function(
    {
      appointmentId,
      locationId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      clients,
      notes,
      entityName,
      oldTrainerId,
      trainerPercentage,
      trainerPay,
      trainerChanged,
      previousTrainerId,
    },
    rescheduled,
    updateDayOnly,
  ) {
    return {
      eventName: 'pastAppointmentUpdated',
      appointmentId,
      locationId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainerId,
      clients,
      notes,
      entityName,
      rescheduled,
      updateDayOnly,
      oldTrainerId,
      trainerPercentage,
      trainerPay,
      trainerChanged,
      previousTrainerId,
    };
  };
};
