module.exports = function(AggregateRootBase, invariant, uuid) {
  return class Session extends AggregateRootBase {
    constructor() {
      super();
      this.type = 'Session';
    }

    static aggregateName() {
      return 'Session';
    }

    commandHandlers() {
      return {
        createSession(cmd) {
          cmd.eventName = 'sessionCreated';
          cmd.id = uuid.v4();
          this.raiseEvent(cmd);
        }
      };
    }

    applyEventHandlers() {
      return {
        sessionCreated: function(event) {
          this._id = event.id;
        }.bind(this)
      };
    }
  };
};
