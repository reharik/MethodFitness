module.exports = function() {
  return state => {
    return {

      trainerHired(event) {
        state._password = event.credentials.password;
        state._id = event.trainerId;
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

      trainersClientsUpdated(cmd) {
        state.trainerClients = cmd.clients;
      },

      trainersNewClientRateSet(cmd) {
        state.trainerClientRates.push({clientId: cmd.clientId, rate: cmd.rate});
      },

      trainerClientRemoved(cmd) {
        state.trainerClientRates = state.trainerClientRates.filter(x => x.clientId !== cmd.clientId);
      },

      trainersClientRateChanged(cmd) {
        state.trainerClientRates = state.trainerClientRates.map(x => {
          return x.clientId === cmd.clientId ? cmd : x;
        });
      }
    };
  };
};
