
module.exports = function(uuid) {
  return class ClientInventory {
    constructor() {
      this.fullHours = 0;
      this.halfHours = 0;
      this.pairs = 0;
    }

    getInventory(cmd) {
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
      this.halfHours ++
    }
    addPairSession() {
      this.pairs ++;
    }

  }
};
