module.exports = function() {
  return state => {
    return {
      trainerHired(event) {
        state._password = event.credentials.password;
        state._id = event.trainerId;
        state.firstName = event.contact.firstName;
        state.lastName = event.contact.lastName;
      },

      trainerPasswordUpdated(event) {
        state._password = event.credentials.password;
      },

      trainerArchived() {
        state._isArchived = true;
      },

      trainerUnArchived() {
        state._isArchived = false;
      },

      trainersClientsUpdated(event) {
        state.trainerClients = event.clients;
      },

      trainersNewClientRateSet(event) {
        state.trainerClientRates.push({
          clientId: event.clientId,
          rate: event.rate,
        });
      },

      trainerClientRemoved(event) {
        state.trainerClientRates = state.trainerClientRates.filter(
          x => x.clientId !== event.clientId,
        );
      },

      trainersClientRateChanged(event) {
        state.trainerClientRates = state.trainerClientRates.map(x => {
          return x.clientId === event.clientId ? event : x;
        });
      },
      trainerContactUpdatedEvent(event) {
        state.firstName = event.contact.firstName;
        state.lastName = event.contact.lastName;
      },
    };
  };
};
