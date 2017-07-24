module.exports = function(AggregateRootBase, esEvents, invariant, uuid) {
  return class Trainer extends AggregateRootBase {
    constructor() {
      super();
      this.trainerClients = [];
      this._password = undefined;
      this._isArchived = false;
      this.type = 'Trainer';
      this._defaultTrainerCientRate = 65;
      this.trainerClientRates = [];
    }

    static aggregateName() {
      return 'Trainer';
    }

    commandHandlers() {
      return {
        hireTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          cmdClone.id = cmdClone.id || uuid.v4();
          this.raiseEvent(esEvents.trainerHiredEvent(cmdClone));
        },
        updateTrainerInfo(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerInfoUpdatedEvent(cmdClone));
        },
        updateTrainerContact(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerContactUpdatedEvent(cmdClone));
        },
        updateTrainerAddress(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerAddressUpdatedEvent(cmdClone));
        },
        updateTrainerPassword(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerPasswordUpdatedEvent(cmdClone));
        },
        verifyAppointments(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerVerifiedAppointmentsEvent(cmdClone));
        },
        payTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          cmdClone.paymentId = uuid.v4();
          this.raiseEvent(esEvents.trainerPaidEvent(cmdClone));
        },


        // 'loginTrainer'  : function(cmd) {
        //     this.expectNotLoggedIn();
        //     this.expectCorrectPassword(cmd.password);
        //     var token = this.createToken();
        //     this.raiseEvent({
        //         eventName: 'trainerLoggedIn',
        //         data     : {
        //             id      : this._id,
        //             userName: cmd.userName,
        //             token   : token,
        //             created : new Date()
        //         }
        //     });
        // },
        archiveTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerArchivedEvent(cmdClone));
        },
        unArchiveTrainer(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectArchived();
          this.raiseEvent(esEvents.trainerunArchivedEvent(cmdClone));
        },
        updateTrainersClientRates(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();

          this.trainerClientRates.filter(x => cmdClone.clientRates.find(y => x.clientId === y.id).rate !== x.rate)
            .map(x => ({
              trainerId: this._id,
              clientId: x.clientId,
              rate: cmdClone.clientRates.find(y => x.clientId === y.id).rate
            }))
            .forEach(e => this.raiseEvent(esEvents.trainersClientRatesUpdatedEvent(e)));

          this.raiseEvent(esEvents.trainersClientRatesUpdatedEvent(cmdClone));

        },
        updateTrainersClients(cmd) {
          let cmdClone = Object.assign({}, cmd);
          this.expectNotArchived();
          this.trainerClients.filter(x => !cmdClone.clients.find(y => y === x))
            .map(x => ({
              trainerId: this._id,
              clientId: x
            }))
            .forEach(e => this.raiseEvent(esEvents.trainerClientRemovedEvent(e)));

          const newClients = cmdClone.clients.filter(x => !this.trainerClients.find(y => y === x));
          newClients
            .map(x => ({
              trainerId: this._id,
              clientId: x
            }))
            .forEach(e => this.raiseEvent(esEvents.trainerClientAddedEvent(e)));
          newClients
            .map(x => ({
              trainerId: this._id,
              clientId: x,
              rate: this._defaultTrainerCientRate
            }))
            .forEach(e => this.raiseEvent(esEvents.trainersNewClientRateSetEvent(e)));

          this.raiseEvent(esEvents.trainersClientsUpdatedEvent(cmdClone));
        }
      };
    }

    applyEventHandlers() {
      return {
        trainerHired: function(event) {
          this._password = event.credentials.password;
          this._id = event.id;
        }.bind(this),

        trainerPasswordUpdated: function(event) {
          this._password = event.credentials.password;
        }.bind(this),

        trainerArchived: function() {
          this._isArchived = true;
        }.bind(this),

        trainerUnArchived: function() {
          this._isArchived = false;
        }.bind(this),

        trainersClientsUpdated: function(cmd) {
          this.trainerClients = cmd.clients;
        }.bind(this),

        trainersNewClientRateSet: function(cmd) {
          this.trainerClientRates.push({clientId: cmd.clientId, rate: cmd.rate});
        }.bind(this),

        trainerClientRemoved: function(cmd) {
          this.trainerClientRates = this.trainerClientRates.filter( x => x.clientId !== cmd.clientId);
        }.bind(this),

        trainersClientRateChanged: function(cmd) {
          this.trainerClientRates = this.trainerClientRates.map( x => {
            return x.clientId === cmd.clientId ? cmd : x;
          });
        }.bind(this)
      };
    }

    createToken() {
      return uuid.v4();
    }

    expectCorrectPassword(password) {
      invariant(password === this._password, 'Incorrect credentials');
    }

    // expectNotLoggedIn() {
    //     invariant(!this._loggedIn, 'Trainer already logged in');
    // }

    expectNotArchived() {
      invariant(!this._isArchived, 'Trainer already archived');
    }

    expectArchived() {
      invariant(this._isArchived, 'Trainer is not archived archived');
    }
  };
};
