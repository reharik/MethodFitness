module.exports = function(invariant) {
  return function(
    {
      commandName,
      appointmentId,
      appointmentType,
      date,
      startTime,
      endTime,
      trainer,
      clients,
      notes,
      originalEntityName,
      entityName
    }
  ) {
    if (commandName !== 'scheduleAppointment') {
      invariant(appointmentId, `scheduleAppointment requires that you pass the appointmentId`);
    }
    if (commandName === 'rescheduleAppointment') {
      invariant(originalEntityName, `rescheduleAppointment requires that you pass in the originalEntityName`);
    }
    invariant(appointmentType, `${commandName} requires that you pass the appointmentType`);
    invariant(trainer, `${commandName} requires that you pass trainer`);
    invariant(date, `${commandName} requires that you pass the appointment date`);
    invariant(startTime, `${commandName} requires that you pass the appointment start time`);
    invariant(endTime, `${commandName} requires that you pass the trainer`);
    invariant(clients && clients.length > 0, `${commandName} requires that you pass at lease 1 client`);
    invariant(
      entityName,
      `${commandName} requires that you pass the 
      enitityName since it's a date but the date prop is utc`
    );
    let result = {
      commandName,
      appointmentType,
      date,
      startTime,
      endTime,
      trainer,
      clients,
      notes,
      entityName,
      originalEntityName
    };
    if (commandName !== 'scheduleAppointment') {
      result.appointmentId = appointmentId;
    }
    if (commandName === 'rescheduleAppointmen') {
      result.originalEntityName = originalEntityName;
    }
    return result;
  };
};
