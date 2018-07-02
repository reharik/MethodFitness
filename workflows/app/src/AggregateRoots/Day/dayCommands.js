module.exports = function(dayInvariants, metaLogger, esEvents, uuid) {
  return (raiseEvent, state) => {
    const invariants = dayInvariants(state);
    return metaLogger(
      {
        scheduleAppointment(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectEndTimeAfterStart(cmdClone);
          invariants.expectAppointmentDurationCorrect(cmdClone);
          invariants.expectCorrectNumberOfClients(cmdClone);
          invariants.expectTrainerNotConflicting(cmdClone);
          invariants.expectClientsNotConflicting(cmdClone);
          cmdClone.appointmentId = uuid.v4();
          // not sure when or why we would keep same id. I thought maybe the past but
          // certainly not the future?
          //cmdClone.commandName === 'scheduleAppointment'
          // || cmdClone.commandName === 'rescheduleAppointmentToNewDay'
          // ? uuid.v4()
          // if  cmdClone.commandName === 'rescheduleAppointmentToNewDay' use same id
          // : cmdClone.appointmentId;

          raiseEvent(esEvents.appointmentScheduledEvent(cmdClone));
        },

        updateAppointment(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectEndTimeAfterStart(cmdClone);
          invariants.expectAppointmentDurationCorrect(cmdClone);
          invariants.expectCorrectNumberOfClients(cmdClone);
          invariants.expectTrainerNotConflicting(cmdClone);
          invariants.expectClientsNotConflicting(cmdClone);

          raiseEvent(esEvents.appointmentUpdatedEvent(cmdClone));
        },

        cancelAppointment(cmd) {
          //TODO put lots of business logic here!
          let cmdClone = Object.assign({}, cmd);
          raiseEvent(esEvents.appointmentCanceledEvent(cmdClone));
        },

        scheduleAppointmentInPast(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectEndTimeAfterStart(cmdClone);
          invariants.expectAppointmentDurationCorrect(cmdClone);
          invariants.expectCorrectNumberOfClients(cmdClone);
          invariants.expectTrainerNotConflicting(cmdClone);
          invariants.expectClientsNotConflicting(cmdClone);
          cmdClone.appointmentId = uuid.v4();

          raiseEvent(esEvents.appointmentScheduledInPastEvent(cmdClone));
        },

        updateAppointmentFromPast(cmd, rescheduled, updateDayOnly) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectEndTimeAfterStart(cmdClone);
          invariants.expectAppointmentDurationCorrect(cmdClone);
          invariants.expectCorrectNumberOfClients(cmdClone);
          invariants.expectTrainerNotConflicting(cmdClone);
          invariants.expectClientsNotConflicting(cmdClone);
          const appointment = state.appointments.find(
            x => x.appointmentId === cmdClone.appointmentId,
          );
          if (appointment && appointment.trainerId !== cmdClone.trainerId) {
            cmdClone.oldTrainerId = appointment.trainerId;
          }
          raiseEvent(
            esEvents.pastAppointmentUpdatedEvent(
              cmdClone,
              rescheduled,
              updateDayOnly,
            ),
          );
        },

        removeAppointmentFromPast(cmd, rescheduled) {
          //TODO put lots of business logic here!
          let cmdClone = Object.assign({}, cmd);
          raiseEvent(
            esEvents.pastAppointmentRemovedEvent(cmdClone, rescheduled),
          );
        },

        getNewAppointmentId(startTime, endTime, trainerId) {
          let item = state.appointments.find(
            x =>
              x.startTime === startTime &&
              x.endTime === endTime &&
              x.trainerId === trainerId,
          );
          return item ? item.appointmentId : undefined;
        },

        getAppointment(appointmentId) {
          return state.appointments.find(
            x => x.appointmentId === appointmentId,
          );
        },
      },
      'dayCommands',
    );
  };
};
