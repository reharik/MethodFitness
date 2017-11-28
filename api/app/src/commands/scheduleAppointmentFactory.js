module.exports = function(invariant) {
  return function({
                     commandName,
                     appointmentId,
                     appointmentType,
                     date,
                     startTime,
                     endTime,
                     trainerId,
                     color,
                     clients,
                     notes,
                     originalEntityName,
                     entityName,
                    changes,
                    isPastToFuture
                   }) {
    if (commandName !== 'scheduleAppointment' && commandName !== 'scheduleAppointmentInPast') {
      invariant(appointmentId, `This command requires that you pass the appointmentId`);
    }
    if (commandName === 'rescheduleAppointment') {
      invariant(originalEntityName, `rescheduleAppointment requires that you pass in the originalEntityName`);
    }
    invariant(appointmentType, `${commandName} requires that you pass the appointmentType`);
    invariant(trainerId, `${commandName} requires that you pass trainerId`);
    invariant(date, `${commandName} requires that you pass the appointment date`);
    invariant(startTime, `${commandName} requires that you pass the appointment start time`);
    invariant(endTime, `${commandName} requires that you pass the appointment end time`);
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
      trainerId,
      color,
      clients,
      notes,
      entityName,
      originalEntityName,
      changes
    };
    if (commandName !== 'scheduleAppointment' && commandName !== 'scheduleAppointmentInPast') {
      result.appointmentId = appointmentId;
    }
    if (commandName === 'rescheduleAppointment' || commandName === 'rescheduleAppointmentFromPast') {
      result.originalEntityName = originalEntityName;
      result.isPastToFuture = isPastToFuture;
    }
    return result;
  };
};

