module.exports = function() {
  return class ClientInventory {
    constructor() {
      this.fullHours = 0;
      this.halfHours = 0;
      this.pairs = 0;
    }

    getInventory() {
      return {
        fullHours: this.fullHours,
        halfHours: this.halfHours,
        pairs: this.pairs
      };
    }

    addFullHourSession() {
      this.fullHours ++;
    }

    addHalfHourSession() {
      this.halfHours ++;
    }
    addPairSession() {
      this.pairs ++;
    }

    checkInventory(cmd) {
      switch (cmd.appointmentType) {
        case 'fullHour': {
          return this.fullHours > 0;
        }
        case 'halfHour': {
          return this.halfHours > 0;
        }
        case 'pair': {
          return this.pairs > 0;
        }
      }
    }

    adjustInventory(event) {
      switch (event.appointmentType) {
        case 'fullHour': {
          this.fullHours --;
          break;
        }
        case 'halfHour': {
          this.halfHours --;
          break;
        }
        case 'pair': {
          this.pair --;
          break;
        }
      }
    }
  };
};
