module.exports = function(AggregateRootBase, invariant, uuid) {
  return class Trainer extends AggregateRootBase {
    constructor() {
      super();
      this._password = undefined;
      this._isArchived = false;
      this.type = 'Trainer';
    }

    static aggregateName() {
      return 'Trainer';
    }

    commandHandlers() {
      return {
        hireTrainer: function(cmd) {
          cmd.id = uuid.v4();
          cmd.eventName = 'trainerHired';
          this.raiseEvent(cmd);
        },
        updateTrainerInfo: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerInfoUpdated';
          this.raiseEvent(cmd);
        },
        updateTrainerContact: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerContactUpdated';
          this.raiseEvent(cmd);
        },
        updateTrainerAddress: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainerAddressUpdated';
          this.raiseEvent(cmd);
        },
        updateTrainerPassword: function(cmd) {
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
        archiveTrainer: function(cmd) {
          this.expectNotArchived();
          this.raiseEvent({
            eventName: 'trainerArchived',
            id: this._id,
            archivedDate: new Date()
          });
        },
        unArchiveUser: function(cmd) {
          this.expectArchived();
          this.raiseEvent({
            eventName: 'trainerUnArchived',
            id: this._id,
            unArchivedDate: new Date()
          });
        },
        updateTrainersClients: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'trainersClientsUpdated';
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

        trainerArchived: function(event) {
          this._isArchived = true;
        }.bind(this),

        trainerUnArchived: function(event) {
          this._isArchived = false;
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
