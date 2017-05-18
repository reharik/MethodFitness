module.exports = function(AggregateRootBase, ClientInventory, invariant, uuid) {
  return class Client extends AggregateRootBase {
    constructor() {
      super();
      this._isArchived;
      this.type = 'Client';
      this.clientInventory = new ClientInventory();
    }

    static aggregateName() {
      return 'Client';
    }

    commandHandlers() {
      return {
        addClient: function(cmd) {
          cmd.id = cmd.id || uuid.v4();
          cmd.eventName = 'clientAdded';
          this.raiseEvent(cmd);
        },
        updateClientInfo: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientInfoUpdated';
          this.raiseEvent(cmd);
        },
        updateClientSource: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientSourceUpdated';
          this.raiseEvent(cmd);
        },
        updateClientContact: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientContactUpdated';
          this.raiseEvent(cmd);
        },
        updateClientAddress: function(cmd) {
          this.expectNotArchived();
          cmd.eventName = 'clientAddressUpdated';
          this.raiseEvent(cmd);
        },
        archiveClient: function(cmd) {
          this.expectNotArchived();
          this.raiseEvent({
            eventName: 'clientArchived',
            id: this._id,
            archivedDate: new Date()
          });
        },
        unArchiveClient: function(cmd) {
          this.expectArchived();
          this.raiseEvent({
            eventName: 'clientUnArchived',
            id: this._id,
            unArchivedDate: new Date()
          });
        },
        purchase: function(cmd) {
          cmd.id = cmd.id || uuid.v4();
          cmd.eventName = 'sessionsPurchased';
          this.generateSessions(cmd).forEach(e => this.raiseEvent(e));
          this.raiseEvent(cmd);
        }
      };
    }

    applyEventHandlers() {
      return {
        clientAdded: function(event) {
          this._id = event.id;
        }.bind(this),

        clientArchived: function(event) {
          this._isArchived = true;
        }.bind(this),
        clientUnArchived: function(event) {
          this._isArchived = false;
        }.bind(this),
        fullHourSessionPurchased: function() {
          this.clientInventory.addFullHourSession();
        }.bind(this),
        halfHourSessionPurchased: function() {
          this.clientInventory.addHalfHourSession();
        }.bind(this),
        pairSessionPurchased: function() {
          this.clientInventory.addPairSession();
        }.bind(this)
      };
    }

    generateSessions(cmd) {
      return [].concat(this.addFullHourSessions(cmd), this.addHalfHourSessions(cmd), this.addPairSessions(cmd));
    }

    createNewSessionEvent(type, purchasePrice, purchaseId) {
      event.eventName = `${type}SessionPurchased`;
      event.clientId = this._id;
      event.sessionId = uuid.v4();
      event.purchaseId = purchaseId;
      event.purchasePrice = purchasePrice;
      event.sessionType = type;
      return event;
    }

    addFullHourSessions(cmd) {
      const individualHourPrice = cmd.fullHour ? cmd.fullHourTotal / cmd.fullHour : 0;
      const tenPackHourPrice = cmd.fullHourTenPack ? cmd.fullHourTenPackTotal / (cmd.fullHourTenPack * 10) : 0;
      let sessions = Array(cmd.fullHour).fill(this.createNewSessionEvent('fullHour', individualHourPrice, cmd.id));
      return sessions.concat(
        Array(cmd.fullHourTenPack * 10).fill(this.createNewSessionEvent('fullHour', tenPackHourPrice, cmd.id))
      );
    }

    addHalfHourSessions(cmd) {
      const individualHalfHourPrice = cmd.halfHour ? cmd.halfHourTotal / cmd.halfHour : 0;
      const tenPackHalfHourPrice = cmd.halfHourTenPack ? cmd.halfHourTenPackTotal / (cmd.halfHourTenPack * 10) : 0;
      let sessions = Array(cmd.halfHour).fill(this.createNewSessionEvent('halfHour', individualHalfHourPrice, cmd.id));
      return sessions.concat(
        Array(cmd.halfHourTenPack * 10).fill(this.createNewSessionEvent('halfHour', tenPackHalfHourPrice, cmd.id))
      );
    }

    addPairSessions(cmd) {
      const individualPairPrice = cmd.pair ? cmd.pairTotal / cmd.pair : 0;
      const tenPackPairPrice = cmd.pairTenPack ? cmd.pairTenPackTotal / (cmd.pairTenPack * 10) : 0;
      let sessions = Array(cmd.pair).fill(this.createNewSessionEvent('pair', individualPairPrice, cmd.id));
      return sessions.concat(
        Array(cmd.pairTenPack * 10).fill(this.createNewSessionEvent('pair', tenPackPairPrice, cmd.id))
      );
    }

    expectNotArchived() {
      invariant(!this._isArchived, 'Client already archived');
    }

    expectArchived() {
      invariant(this._isArchived, 'Client is not archived archived');
    }
  };
};
