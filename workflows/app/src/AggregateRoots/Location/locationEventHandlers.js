module.exports = function() {
  return state => {
    return {
      locationAdded: event => {
        state._id = event.locationId;
      },

      locationArchived() {
        state._isArchived = true;
      },

      locationUnarchived() {
        state._isArchived = false;
      },

      locationUpdated: () => {
        /*no-op*/
      },
    };
  };
};
