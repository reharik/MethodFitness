module.exports = function(AggregateRootBase, invariant, uuid) {
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
          cmd.eventName = 'trainerHired';
          this.raiseEvent(cmd);
        },
        updateTrainerInfo(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerInfoUpdated';
          this.raiseEvent(cmd);
        },
        updateTrainerContact(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerContactUpdated';
          this.raiseEvent(cmd);
        },
        updateTrainerAddress(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerAddressUpdated';
          this.raiseEvent(cmd);
        },
        updateTrainerPassword(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerPasswordUpdated';
          this.raiseEvent(cmd);
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
        archiveTrainer() {
          this.expectNotArchived();
          this.raiseEvent({
            eventName: 'trainerArchived',
            id: this._id,
            archivedDate: new Date()
          });
        },
        unArchiveUser() {
          this.expectArchived();
          this.raiseEvent({
            eventName: 'trainerUnArchived',
            id: this._id,
            unArchivedDate: new Date()
          });
        },
        updateTrainersClientRates(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainersClientRatesUpdated';

          this.trainerClientRates.filter(x => cmd.clients.find(y => x.clientId === y).rate !== x.rate)
            .map(x => ({
              eventName: 'trainersClientRateChanged',
              trainerId: this._id,
              clientId: x,
              rate: x.rate
            }))
            .forEach(e => this.raiseEvent(e));
          this.raiseEvent(cmd);

        },
        updateTrainersClients(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainersClientsUpdated';
          this.trainerClients.filter(x => !cmd.clients.find(y => y === x))
            .map(x => ({
              eventName: 'trainerClientRemoved',
              trainerId: this._id,
              clientId: x
            }))
            .forEach(e => this.raiseEvent(e));
          const newClients = cmd.clients.filter(x => !this.trainerClients.find(y => y === x));
          newClients
            .map(x => ({
              eventName: 'trainerClientAdded',
              trainerId: this._id,
              clientId: x
            }))
            .forEach(e => this.raiseEvent(e));
          newClients
            .map(x => ({
              eventName: 'trainersNewClientRateSet',
              trainerId: this._id,
              clientId: x,
              rate: this._defaultTrainerCientRate
            }))
            .forEach(e => this.raiseEvent(e));
          this.raiseEvent(cmd);
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
