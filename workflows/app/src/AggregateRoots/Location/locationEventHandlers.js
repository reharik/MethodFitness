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

      locationUpdated: event => {
        state.unfundedAppointments = state.unfundedAppointments.map(
          x =>
            x.appointmentId === event.appointmentId
              ? Object.assign({}, x, {
                  name: event.name,
                })
              : x,
        );
      },
    };
  };
};
