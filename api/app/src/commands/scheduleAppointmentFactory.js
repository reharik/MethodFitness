module.exports = function(invariant, riMoment) {
  return function({
    commandName,
    appointmentId,
    locationId,
    appointmentType,
    appointmentDate,
    startTime,
    endTime,
    trainerId,
    color,
    clients,
    notes,
    originalEntityName,
    entityName,
    changes,
    isPastToFuture,
    isFutureToPast,
  }) {
    const riStartTime = riMoment(startTime).format();
    const riEndTime = riMoment(endTime).format();

    if (
      commandName !== 'scheduleAppointment' &&
      commandName !== 'scheduleAppointmentInPast'
    ) {
      invariant(
        appointmentId,
        `This command requires that you pass the appointmentId`,
      );
    }
    if (commandName === 'rescheduleAppointment') {
      invariant(
        originalEntityName,
        `rescheduleAppointment requires that you pass in the originalEntityName`,
      );
    }
    invariant(
      appointmentType,
      `${commandName} requires that you pass the appointmentType`,
    );
    invariant(
      locationId,
      `${commandName} requires that you pass the locationId`,
    );
    invariant(trainerId, `${commandName} requires that you pass trainerId`);
    invariant(
      appointmentDate,
      `${commandName} requires that you pass the appointment date`,
    );
    invariant(
      riStartTime,
      `${commandName} requires that you pass the appointment start time`,
    );
    invariant(
      riEndTime,
      `${commandName} requires that you pass the appointment end time`,
    );
    invariant(
      clients && clients.length > 0,
      `${commandName} requires that you pass at lease 1 client`,
    );
    invariant(
      entityName,
      `${commandName} requires that you pass the 
      enitityName since it's a date but the date prop is utc`,
    );
    let result = {
      locationId,
      commandName,
      appointmentType,
      appointmentDate,
      startTime: riStartTime,
      endTime: riEndTime,
      trainerId,
      color,
      clients,
      notes,
      entityName,
      originalEntityName,
      changes,
      isPastToFuture,
      isFutureToPast,
    };
    if (
      commandName !== 'scheduleAppointment' &&
      commandName !== 'scheduleAppointmentInPast'
    ) {
      result.appointmentId = appointmentId;
    }

    return result;
  };
};
