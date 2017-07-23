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
          cmd.id = cmd.id || uuid.v4();
          this.raiseEvent(esEvents.trainerHiredEvent(cmd));
        },
        updateTrainerInfo(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerInfoUpdatedEvent(cmd));
        },
        updateTrainerContact(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerContactUpdatedEvent(cmd));
        },
        updateTrainerAddress(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerAddressUpdatedEvent(cmd));
        },
        updateTrainerPassword(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerPasswordUpdatedEvent(cmd));
        },
        verifyAppointments(cmd) {
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerVerifiedAppointmentsEvent(cmd));
        },
        payTrainer(cmd) {
          this.expectNotArchived();
          cmd.paymentId = uuid.v4();
          this.raiseEvent(esEvents.trainerPaidEvent(cmd));
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
          this.expectNotArchived();
          this.raiseEvent(esEvents.trainerArchivedEvent(cmd));
        },
        unArchiveTrainer(cmd) {
          this.expectArchived();
          this.raiseEvent(esEvents.trainerunArchivedEvent(cmd));
        },
        updateTrainersClientRates(cmd) {
          this.expectNotArchived();

          this.trainerClientRates.filter(x => cmd.clientRates.find(y => x.clientId === y.id).rate !== x.rate)
            .map(x => ({
              trainerId: this._id,
              clientId: x.clientId,
              rate: cmd.clientRates.find(y => x.clientId === y.id).rate
            }))
            .forEach(e => this.raiseEvent(esEvents.trainersClientRatesUpdatedEvent(e)));

          this.raiseEvent(esEvents.trainersClientRatesUpdatedEvent(cmd));

        },
        updateTrainersClients(cmd) {
          this.expectNotArchived();
          this.trainerClients.filter(x => !cmd.clients.find(y => y === x))
            .map(x => ({
              trainerId: this._id,
              clientId: x
            }))
            .forEach(e => this.raiseEvent(esEvents.trainerClientRemovedEvent(e)));

          const newClients = cmd.clients.filter(x => !this.trainerClients.find(y => y === x));
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

          this.raiseEvent(esEvents.trainersClientsUpdatedEvent(cmd));
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
