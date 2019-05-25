module.exports = function(
  trainerInvariants,
  rsRepository,
  eventRepository,
  esEvents,
  metaLogger,
  uuid,
  logger,
) {
  return (raiseEvent, state) => {
    const invariants = trainerInvariants(state);

    const hireTrainer = cmd => {
      let cmdClone = Object.assign({}, cmd);
      cmdClone.trainerId = cmdClone.trainerId || uuid.v4();
      raiseEvent(esEvents.trainerHiredEvent(cmdClone));
    };

    const updateTrainerInfo = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.trainerInfoUpdatedEvent(cmdClone));
    };

    const updateTrainerContact = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.trainerContactUpdatedEvent(cmdClone));
    };

    const updateTrainerAddress = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.trainerAddressUpdatedEvent(cmdClone));
    };

    const updateTrainerPassword = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.trainerPasswordUpdatedEvent(cmdClone));
    };

    const verifyAppointments = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.trainerVerifiedAppointmentsEvent(cmdClone));
    };

    const payTrainer = async (cmd, client) => {
      rsRepository = await rsRepository;
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      cmdClone.paymentId = uuid.v4();

      for (let paid of cmd.paidAppointments) {
        // should probably get this from ES but I'm still
        // creaped out by deriving the Entity Name from the
        // appointmentDate, which I don't even have here
        // and there is no chance of a race condition here
        // because it's looking an appointment that has been there for awhile
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

        //TODO remove after migration
        // for migration
        let TP = 0;
        let TCR;
        if (cmd.migration) {
          const session = clientInstance.state.clientInventory.getUsedSessionByAppointmentId(
            paid.appointmentId,
          );
          TP = session.trainerPay;
          TCR = {rate: session.trainerPercentage};
        } else {
          // const TCR = getTrainerClientRateByClientId(paid.clientId);
          TCR = getTrainerClientRateByClientId(paid.clientId);

          // let TP = 0;
          if (TCR && purchasePrice) {
            TP = purchasePrice * (TCR.rate * 0.01);
          }
        }
        paid.appointmentDate = appointment.appointmentDate;
        paid.startTime = appointment.startTime;
        paid.appointmentType = appointment.appointmentType;

        paid.trainerFirstName = state.firstName;
        paid.trainerLastName = state.lastName;
        paid.clientFirstName = clientInstance.state.firstName;
        paid.clientLastName = clientInstance.state.lastName;
        paid.pricePerSession = purchasePrice;
        paid.trainerPercentage = TCR ? TCR.rate : 0;
        paid.trainerPay = TP;
      }

      raiseEvent(esEvents.trainerPaidEvent(cmdClone));
    };

    // 'loginTrainer'  : functioncmd {
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
    const archiveTrainer = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.trainerArchivedEvent(cmdClone));
    };

    const unArchiveTrainer = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectArchived();
      raiseEvent(esEvents.trainerUnarchivedEvent(cmdClone));
    };

    const updateTrainersClientRates = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();

      state.trainerClientRates
        .filter(
          x =>
            cmdClone.clientRates.find(y => x.clientId === y.clientId).rate !==
            x.rate,
        )
        .map(x => ({
          trainerId: state._id,
          clientId: x.clientId,
          rate: cmdClone.clientRates.find(y => x.clientId === y.clientId).rate,
        }))
        .forEach(e => {
          let event = Object.assign(e, {
            createdDate: cmd.createdDate,
            createdById: cmd.createdById,
          });
          return raiseEvent(esEvents.trainersClientRatesUpdatedEvent(event));
        });

      raiseEvent(esEvents.trainersClientRatesUpdatedEvent(cmdClone));
    };

    const updateTrainersClients = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      state.trainerClients
        .filter(x => !cmdClone.clients.find(y => y === x))
        .map(x => ({
          trainerId: state._id,
          clientId: x,
        }))
        .forEach(e => {
          let event = Object.assign(e, {
            createdDate: cmdClone.createdDate,
            createdById: cmdClone.createdById,
          });
          return raiseEvent(esEvents.trainerClientRemovedEvent(event));
        });

      const newClients = cmdClone.clients.filter(
        x => !state.trainerClients.find(y => y === x),
      );
      newClients
        .map(x => ({
          trainerId: state._id,
          clientId: x,
        }))
        .forEach(e => {
          let event = Object.assign(e, {
            createdDate: cmdClone.createdDate,
            createdById: cmdClone.createdById,
          });
          return raiseEvent(esEvents.trainerClientAddedEvent(event));
        });
      newClients
        .map(x => ({
          trainerId: state._id,
          clientId: x,
          rate: state.defaultTrainerClientRate,
        }))
        .forEach(e => {
          let event = Object.assign(e, {
            createdDate: cmdClone.createdDate,
            createdById: cmdClone.createdById,
          });
          return raiseEvent(esEvents.trainersNewClientRateSetEvent(event));
        });

      raiseEvent(esEvents.trainersClientsUpdatedEvent(cmdClone));
    };

    const getTrainerClientRateByClientId = clientId => {
      const rate = state.trainerClientRates.find(x => x.clientId === clientId);
      if (!rate) {
        logger.warn(
          `Client Rate requested for Trainer: ${state.firstName} ${
            state.lastName
          } - ${
            state._id
          } whose Client list does not include this client: ${clientId}`,
        );
        return state.defaultTrainerClientRate;
      }
      return rate;
    };

    const updateDefaultTrainerClientRate = cmd => {
      let cmdClone = Object.assign({}, cmd);
      invariants.expectNotArchived();
      raiseEvent(esEvents.defaultTrainerClientRateUpdatedEvent(cmdClone));
    };

    return metaLogger(
      {
        hireTrainer,
        updateTrainerInfo,
        updateTrainerContact,
        updateTrainerAddress,
        updateTrainerPassword,
        verifyAppointments,
        payTrainer,
        archiveTrainer,
        unArchiveTrainer,
        updateTrainersClientRates,
        updateTrainersClients,
        getTrainerClientRateByClientId,
        updateDefaultTrainerClientRate,
      },
      'TrainerCommands',
    );
  };
};
