module.exports = function(dayInvariants, esEvents, uuid) {
  return (raiseEvent, state) => {
    const invariants = dayInvariants(state);
    return {
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

      updateAppointmentFromPast(cmd) {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectEndTimeAfterStart(cmdClone);
        invariants.expectAppointmentDurationCorrect(cmdClone);
        invariants.expectCorrectNumberOfClients(cmdClone);
        invariants.expectTrainerNotConflicting(cmdClone);
        invariants.expectClientsNotConflicting(cmdClone);

        raiseEvent(esEvents.pastAppointmentUpdatedEvent(cmdClone));
      },
      // this is for when we have changed days, and need to add appt to new AR
      // but it's an existing appt so we don't give it a new uuid but we have to use
      // the pastAppointmentUpdatedEvent
      rescheduleAppointmentInPast(cmd) {
        let cmdClone = Object.assign({}, cmd, {rescheduled: true});
        invariants.expectEndTimeAfterStart(cmdClone);
        invariants.expectAppointmentDurationCorrect(cmdClone);
        invariants.expectCorrectNumberOfClients(cmdClone);
        invariants.expectTrainerNotConflicting(cmdClone);
        invariants.expectClientsNotConflicting(cmdClone);
        raiseEvent(esEvents.pastAppointmentUpdatedEvent(cmdClone));
      },

      removeAppointmentFromPast(cmd) {
        //TODO put lots of business logic here!
        let cmdClone = Object.assign({}, cmd);
        raiseEvent(esEvents.pastAppointmentRemovedEvent(cmdClone));
      },

      getNewAppointmentId(startTime, endTime, trainerId) {
        let item = state.appointments.find(
          x => x.startTime === startTime && x.endTime === endTime && x.trainerId === trainerId
        );
        return item ? item.appointmentId : undefined;
      },

      getAppointment(appointmentId) {
        return state.appointments.find(x => x.appointmentId === appointmentId);
      }
    };
  };
};
