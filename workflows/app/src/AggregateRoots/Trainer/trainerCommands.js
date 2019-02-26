module.exports = function(
  trainerInvariants,
  rsRepository,
  eventRepository,
  esEvents,
  metaLogger,
  trainer,
  client,
  uuid,
) {
  return (raiseEvent, state) => {
    const invariants = trainerInvariants(state);
    return metaLogger(
      {
        hireTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          cmdClone.trainerId = cmdClone.trainerId || uuid.v4();
          raiseEvent(esEvents.trainerHiredEvent(cmdClone));
        },

        updateTrainerInfo(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.trainerInfoUpdatedEvent(cmdClone));
        },

        updateTrainerContact(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.trainerContactUpdatedEvent(cmdClone));
        },

        updateTrainerAddress(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.trainerAddressUpdatedEvent(cmdClone));
        },

        updateTrainerPassword(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.trainerPasswordUpdatedEvent(cmdClone));
        },

        verifyAppointments(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.trainerVerifiedAppointmentsEvent(cmdClone));
        },

        async payTrainer(cmd) {
          rsRepository = await rsRepository;
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          cmdClone.paymentId = uuid.v4();
          const trainerInstance = await eventRepository.getById(
            trainer,
            cmdClone.trainerId,
          );
          for (let paid of cmd.paidAppointment) {
            const appointment = await rsRepository.getById(
              paid.appointmentId,
              'appointment',
            );
            const clientInstance = await eventRepository.getById(
              client,
              paid.clientId,
            );
            const purchasePrice = clientInstance.getPurchasePriceOfSessionByAppointmentId(
              paid.appointmentId,
            );
            const TCR = state.trainerClientRates.find(
              x => x.clientId === paid.clientId,
            );
            let TR = 0;
            if (TCR && purchasePrice) {
              TR = purchasePrice * (TCR.rate * 0.01);
            }
            paid.appointmentDate = appointment.date;
            paid.appointmentStartTime = appointment.startTime;
            paid.appointmentType = appointment.appointmentType;

            paid.trainerFirstName = trainerInstance.contact.firstName;
            paid.trainerLastName = trainerInstance.contact.lastName;
            paid.clientFirstName = clientInstance.firstName;
            paid.clientlastName = clientInstance.lastName;
            paid.pricePerSession = purchasePrice;
            paid.trainerPercentage = TCR ? TCR.rate : 0;
            paid.trainerPay = TR;
          }

          raiseEvent(esEvents.trainerPaidEvent(cmdClone));
        },

        // 'loginTrainer'  : function(cmd) {
        //     state.expectNotLoggedIn();
        //     state.expectCorrectPassword(cmd.password);
        //     var token = state.createToken();
        //     raiseEvent({
        //         eventName: 'trainerLoggedIn',
        //         data     : {
        //             id      : state._id,
        //             userName: cmd.userName,
        //             token   : token,
        //             created : new Date()
        //         }
        //     });
        // },
        archiveTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.trainerArchivedEvent(cmdClone));
        },

        unArchiveTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectArchived();
          raiseEvent(esEvents.trainerUnarchivedEvent(cmdClone));
        },

        updateTrainersClientRates(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();

          state.trainerClientRates
            .filter(
              x =>
                cmdClone.clientRates.find(y => x.clientId === y.clientId)
                  .rate !== x.rate,
            )
            .map(x => ({
              trainerId: state._id,
              clientId: x.clientId,
              rate: cmdClone.clientRates.find(y => x.clientId === y.clientId)
                .rate,
            }))
            .forEach(e =>
              raiseEvent(esEvents.trainersClientRatesUpdatedEvent(e)),
            );

          raiseEvent(esEvents.trainersClientRatesUpdatedEvent(cmdClone));
        },

        updateTrainersClients(cmd) {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          state.trainerClients
            .filter(x => !cmdClone.clients.find(y => y === x))
            .map(x => ({
              trainerId: state._id,
              clientId: x,
            }))
            .forEach(e => raiseEvent(esEvents.trainerClientRemovedEvent(e)));

          const newClients = cmdClone.clients.filter(
            x => !state.trainerClients.find(y => y === x),
          );
          newClients
            .map(x => ({
              trainerId: state._id,
              clientId: x,
            }))
            .forEach(e => raiseEvent(esEvents.trainerClientAddedEvent(e)));
          newClients
            .map(x => ({
              trainerId: state._id,
              clientId: x,
              rate: state._defaultTrainerCientRate,
            }))
            .forEach(e =>
              raiseEvent(esEvents.trainersNewClientRateSetEvent(e)),
            );

          raiseEvent(esEvents.trainersClientsUpdatedEvent(cmdClone));
        },
      },
      'TrainerCommands',
    );
  };
};
