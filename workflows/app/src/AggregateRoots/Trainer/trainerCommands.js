module.exports = function(trainerInvariants, esEvents, uuid) {
  return (raiseEvent, state) => {
    const invariants = trainerInvariants(state);
    return {
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

      payTrainer(cmd) {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        cmdClone.paymentId = uuid.v4();
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
        raiseEvent(esEvents.trainerunArchivedEvent(cmdClone));
      },

      updateTrainersClientRates(cmd) {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();

        state.trainerClientRates.filter(x => cmdClone.clientRates.find(y => x.clientId === y.clientId).rate !== x.rate)
          .map(x => ({
            trainerId: state._id,
            clientId: x.clientId,
            rate: cmdClone.clientRates.find(y => x.clientId === y.id).rate
          }))
          .forEach(e => raiseEvent(esEvents.trainersClientRatesUpdatedEvent(e)));

        raiseEvent(esEvents.trainersClientRatesUpdatedEvent(cmdClone));

      },

      updateTrainersClients(cmd) {
        let cmdClone = Object.assign({}, cmd);
        invariants.expectNotArchived();
        state.trainerClients.filter(x => !cmdClone.clients.find(y => y === x))
          .map(x => ({
            trainerId: state._id,
            clientId: x
          }))
          .forEach(e => raiseEvent(esEvents.trainerClientRemovedEvent(e)));

        const newClients = cmdClone.clients.filter(x => !state.trainerClients.find(y => y === x));
        newClients
          .map(x => ({
            trainerId: state._id,
            clientId: x
          }))
          .forEach(e => raiseEvent(esEvents.trainerClientAddedEvent(e)));
        newClients
          .map(x => ({
            trainerId: state._id,
            clientId: x,
            rate: state._defaultTrainerCientRate
          }))
          .forEach(e => raiseEvent(esEvents.trainersNewClientRateSetEvent(e)));

        raiseEvent(esEvents.trainersClientsUpdatedEvent(cmdClone));
      }
    };
  };
};
