module.exports = function(
  locationInvariants,
  esEvents,
  uuid,
  logger,
  metaLogger,
) {
  return (raiseEvent, state) => {
    const invariants = locationInvariants(state);
    return metaLogger(
      {
        addLocation: cmd => {
          let cmdClone = Object.assign({}, cmd);
          cmdClone.locationId = cmdClone.locationId || uuid.v4();
          raiseEvent(esEvents.locationAddedEvent(cmdClone));
        },

        updateLocation: cmd => {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.locationUpdatedEvent(cmdClone));
        },

        archiveLocation: cmd => {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectNotArchived();
          raiseEvent(esEvents.locationArchivedEvent(cmdClone));
        },

        unArchiveLocation: cmd => {
          let cmdClone = Object.assign({}, cmd);
          invariants.expectArchived();
          raiseEvent(esEvents.locationUnarchivedEvent(cmdClone));
        },
      },

      'LocationCommands',
    );
  };
};
