"use strict";

module.exports = function(eventstorenode, gesConnection, logger, events, uuid) {
  return function eventstore(options) {
    const configs = options.eventstore;
    const credentialsForAllEventsStream = new eventstorenode.UserCredentials(configs.systemUsers.admin, configs.systemUsers.adminPassword);

    const eventEmitterInstance = () =>  {
      const emitter = new events.EventEmitter();
      const emitEvent = (sub, e) => {
        emitter.emit('event', e);
      };
      return {
        emitter,
        emitEvent
      }
    };

    const liveProcessingStarted = () => {
      logger.trace("Caught up with previously stored events. Listening for new events.");
    };

    const subscriptionDropped = (subscription, reason, error) => {
      if (error) {
        logger.error(error)
      }
      logger.info('Subscription dropped.');
    };
    let ges = gesConnection;
    if(typeof gesConnection === 'function'){
      ges = gesConnection(options);
    }

    const commandPoster = async function (command, commandName, continuationId) {
      // fortify commands with metadata like date and user
      command.createDate = new Date();
      let event = eventstorenode.createJsonEventData(uuid.v4(), command, {eventName:commandName, continuationId, streamType:'command'}, commandName);
      await ges.appendToStream('command', eventstorenode.expectedVersion.any, [event], credentialsForAllEventsStream);
    };

    return {
      eventEmitterInstance,
      liveProcessingStarted,
      subscriptionDropped,
      gesConnection: ges,
      createEventData:eventstorenode.createEventData,
      createJsonEventData:eventstorenode.createJsonEventData,
      expectedVersion: eventstorenode.expectedVersion,
      credentials: credentialsForAllEventsStream,
      commandPoster
    };
  }
};
