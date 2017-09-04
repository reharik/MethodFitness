module.exports = function(dayInvariants, esEvents, uuid) {
  return (raiseEvent, state) => {
    const invariants = dayInvariants(state);
    return {
      updateAppointment(cmd) {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectEndTimeAfterStart(cmdClone);
        invariants.expectAppointmentDurationCorrect(cmdClone);
        invariants.expectCorrectNumberOfClients(cmdClone);
        invariants.expectTrainerNotConflicting(cmdClone);
        invariants.expectClientsNotConflicting(cmdClone);

        raiseEvent(esEvents.appointmentUpdatedEvent(cmdClone));
      },

      scheduleAppointment(cmd) {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectEndTimeAfterStart(cmdClone);
        invariants.expectAppointmentDurationCorrect(cmdClone);
        invariants.expectCorrectNumberOfClients(cmdClone);
        invariants.expectTrainerNotConflicting(cmdClone);
        invariants.expectClientsNotConflicting(cmdClone);
        cmdClone.appointmentId = cmdClone.commandName === 'scheduleAppointment'
        || cmdClone.commandName === 'rescheduleAppointmentToNewDay'
          ? uuid.v4()
          : cmdClone.appointmentId;

        raiseEvent(esEvents.appointmentScheduledEvent(cmdClone));
      },

      cancelAppointment(cmd) {
        //TODO put lots of business logic here!
        let cmdClone = Object.assign({}, cmd);
        raiseEvent(esEvents.appointmentCanceledEvent(cmdClone));
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
      }
    };
  };
};
