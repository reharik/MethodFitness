module.exports = function(
  dayInvariants,
  eventRepository,
  trainer,
  client,
  metaLogger,
  esEvents,
  uuid,
) {
  return (raiseEvent, state) => {
    const invariants = dayInvariants(state);
    return metaLogger(
      {
        async scheduleAppointment(cmdClone) {
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

        async updateAppointment(cmdClone) {
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

        async scheduleAppointmentInPast(cmdClone) {
          invariants.expectEndTimeAfterStart(cmdClone);
          invariants.expectAppointmentDurationCorrect(cmdClone);
          invariants.expectCorrectNumberOfClients(cmdClone);
          invariants.expectTrainerNotConflicting(cmdClone);
          invariants.expectClientsNotConflicting(cmdClone);
          cmdClone.appointmentId = uuid.v4();
          raiseEvent(esEvents.appointmentScheduledInPastEvent(cmdClone));
        },

        async updateAppointmentFromPast(cmd, clients) {
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
            cmdClone.trainerChanged = true;
            cmdClone.previousTrainerId = appointment.trainerId;
            const trainerInstance = await eventRepository.getById(
              trainer,
              cmdClone.trainerId,
            );

            for (let clientInstance of clients) {
              const purchasePrice = clientInstance.getPurchasePriceOfSessionByAppointmentId(
                cmdClone.appointmentId,
              );
              const TCR = trainerInstance.getTrainerClientRateByClientId(
                clientInstance.state._id,
              );
              // If no purchase price then unfunded appointment.  not very delcaritive
              let TR = 0;
              if (TCR && purchasePrice) {
                TR = purchasePrice * (TCR.rate * 0.01);
              }

              const cmdReClone = Object.assign({}, cmdClone, {
                trainerPercentage: TCR.rate || 0,
                trainerPay: TR,
              });
              let event = esEvents.pastAppointmentUpdatedEvent(cmdReClone);
              raiseEvent(event);
            }
          } else {
            let event = esEvents.pastAppointmentUpdatedEvent(cmdClone);
            raiseEvent(event);
          }
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
