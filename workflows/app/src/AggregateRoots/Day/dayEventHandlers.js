module.exports = function() {
  return state => {
    return {
      appointmentScheduled(event) {
        if (!state._id) {
          state._id = event.entityName;
        }
        state.appointments.push({
          appointmentId: event.appointmentId,
          appointmentType: event.appointmentType,
          startTime: event.startTime,
          endTime: event.endTime,
          trainerId: event.trainerId,
          clients: event.clients,
          //TODO remove after migration
          legacyId: event.legacyId || '',
          lateCancellation: event.lateCancellation,
        });
      },

      appointmentUpdated(event) {
        state.appointments.forEach(x => {
          if (x.appointmentId === event.appointmentId) {
            x.appointmentType = event.appointmentType;
            x.startTime = event.startTime;
            x.endTime = event.endTime;
            x.trainerId = event.trainerId;
            x.clients = event.clients;
          }
        });
      },

      appointmentCanceled(event) {
        state.appointments = state.appointments.filter(
          x => x.appointmentId !== event.appointmentId,
        );
      },

      pastAppointmentRemoved(event) {
        state.appointments = state.appointments.filter(
          x => x.appointmentId !== event.appointmentId,
        );
      },

      appointmentScheduledInPast(event) {
        this.appointmentScheduled(event);
      },

      pastAppointmentUpdated(event) {
        if (event.rescheduled) {
          this.appointmentScheduled(event);
        } else {
          this.appointmentUpdated(event);
        }
      },
    };
  };
};
