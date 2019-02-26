module.exports = function() {
  return state => {
    return {
      locationAdded: event => {
        state._id = event.locationId;
        state.name = event.name;
      },

      locationArchived() {
        state._isArchived = true;
      },

      locationUnarchived() {
        state._isArchived = false;
      },

      locationUpdated: () => {
        state.name = event.name;
      },
    };
  };
};
