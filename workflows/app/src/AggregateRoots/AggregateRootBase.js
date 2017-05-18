module.exports = function(invariant, logger) {
  return class AggregateRootBase {
    constructor() {
      this._version = -1; // corresponds to ExpectedEvent.NoStream
      this.uncommittedEvents = [];

      invariant(this.commandHandlers, 'An aggregateRoot requires commandHandlers');
      invariant(this.applyEventHandlers, 'An aggregateRoot requires applyEventHandlers');

      Object.assign(this, this.commandHandlers());
    }

    applyEvent(event) {
      logger.debug(`${event.eventName} currently in applyEvent`);
      logger.debug(JSON.stringify(event));
      var eventHandlers = this.applyEventHandlers();
      var key = Object.keys(eventHandlers).find(x => x === event.eventName);
      if (key) {
        eventHandlers[key](event);
      }
      this._version++;
    }

    raiseEvent(event) {
      this.applyEvent(event);
      this.uncommittedEvents.push(event);
    }

    getUncommittedEvents() {
      return this.uncommittedEvents;
    }

    clearUncommittedEvents() {
      this.uncommittedEvents = [];
    }

    static isAggregateBase() {
      return true;
    }

    isAggregateBase() {
      return true;
    }
  };
};
