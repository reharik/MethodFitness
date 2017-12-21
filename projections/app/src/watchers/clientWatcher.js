module.exports = function(metaLogger) {
  return function(state, persistence, handlerName) {

    async function clientAdded(event) {
      let sanitizeName = name => {
        let _name = name.replace(`'`, `\'`);
        return _name.trim();
      };
      const client = {
        clientId: event.clientId,
        firstName: sanitizeName(event.contact.firstName),
        lastName: sanitizeName(event.contact.lastName)
      };
      state.innerState.clients.push(client);

      await persistence.saveState(state);
    }

    async function clientContactUpdated(event) {
      const subEvent = {
        clientId: event.clientId,
        firstName: event.contact.firstName,
        lastName: event.contact.lastName
      };

      state.innerState.clients.map(x =>
        x.clientId === subEvent.clientId
          ? subEvent
          : x);
      await persistence.saveState(state);
    }

    return metaLogger({
      clientAdded,
      clientContactUpdated
    }, handlerName);
  };
};
