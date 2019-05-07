module.exports = function(esEvents, uuid, logger, metaLogger) {
  return raiseEvent => {
    return metaLogger(
      {
        updateDefaultClientRates: cmd => {
          let cmdClone = Object.assign({}, cmd);
          cmdClone.defaultClientRatesId =
            cmdClone.defaultClientRatesId || uuid.v4();
          console.log(
            `==========esEvents.defaultClientRatesUpdatedEvent(cmdClone)==========`,
          );
          console.log(esEvents.defaultClientRatesUpdatedEvent(cmdClone));
          console.log(
            `==========END esEvents.defaultClientRatesUpdatedEvent(cmdClone)==========`,
          );

          raiseEvent(esEvents.defaultClientRatesUpdatedEvent(cmdClone));
        },
      },

      'DefaultClientRatesCommands',
    );
  };
};
