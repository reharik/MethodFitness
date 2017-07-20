module.exports = function(AggregateRootBase, esEvents, invariant, uuid, moment) {
  return class Day extends AggregateRootBase {
    constructor() {
      super();
      this.type = 'Day';
      this.appointments = [];
    }

    static aggregateName() {
      return 'Day';
    }

    getNewAppointmentId(startTime, endTime, trainerId) {
      let item = this.appointments.find(
        x => x.startTime === startTime && x.endTime === endTime && x.trainerId === trainerId
      );
      return item ? item.id : undefined;
    }

    commandHandlers() {
      const updateAppointment = function(cmd) {
        this.expectEndTimeAfterStart(cmd);
        this.expectAppointmentDurationCorrect(cmd);
        this.expectCorrectNumberOfClients(cmd);
        this.expectTrainerNotConflicting(cmd);
        this.expectClientsNotConflicting(cmd);

        this.raiseEvent(esEvents.appointmentUpdatedEvent(cmd));
      }.bind(this);

      const scheduleAppointment = function(cmd) {
        this.expectEndTimeAfterStart(cmd);
        this.expectAppointmentDurationCorrect(cmd);
        this.expectCorrectNumberOfClients(cmd);
        this.expectTrainerNotConflicting(cmd);
        this.expectClientsNotConflicting(cmd);
        cmd.appointmentId = cmd.commandName === 'scheduleAppointment'
        || cmd.commandName === 'rescheduleAppointmentToNewDay'
          ? uuid.v4()
          : cmd.appointmentId;

        this.raiseEvent(esEvents.appointmentScheduledEvent(cmd));
      }.bind(this);

      const _cancelAppointment = function(cmd) {
        //TODO put lots of business logic here!
        this.raiseEvent(esEvents.appointmentCanceledEvent(cmd));
      }.bind(this);

      return {
        scheduleAppointment(cmd) {
          scheduleAppointment(cmd);
        },
        updateAppointment(cmd) {
          updateAppointment(cmd);
        },
        cancelAppointment(cmd) {
          _cancelAppointment(cmd);
        }
      };
    }

    applyEventHandlers() {
      const _appointmentScheduled = function(event) {
        if (!this._id) {
          this._id = event.entityName;
        }
        this.appointments.push({
          id: event.id,
          appointmentType: event.appointmentType,
          startTime: event.startTime,
          endTime: event.endTime,
          trainerId: event.trainerId,
          clients: event.clients
        });
      }.bind(this);

      const appointmentUpdated = function(event) {
        this.appointments.forEach(x => {
          if (x.id === event.id) {
            x.appointmentType = event.appointmentType;
            x.startTime = event.startTime;
            x.endTime = event.endTime;
            x.trainerId = event.trainerId;
            x.clients = event.clients;
          }
        });
      }.bind(this);

      const _appointmentCanceled = function(event) {
        this.appointments = this.appointments.filter(x => x.id !== event.id);
      }.bind(this);

      return {
        appointmentMovedFromDifferentDay(event) {
          _appointmentScheduled(event);
        },
        appointmentScheduled(event) {
          _appointmentScheduled(event);
        },
        appointmentMovedToDifferentDay(event) {
          _appointmentCanceled(event);
        },
        appointmentCanceled(event) {
          _appointmentCanceled(event);
        },
        appointmentUpdated(event) {
          appointmentUpdated(event);
        }
      };
    }

    expectEndTimeAfterStart(cmd) {
      invariant(
        moment(cmd.endTime).isAfter(moment(cmd.startTime)),
        'Appointment End Time must be after Appointment Start Time'
      );
    }

    expectAppointmentDurationCorrect(cmd) {
      let diff = moment(cmd.endTime).diff(moment(cmd.startTime), 'minutes');
      switch (cmd.appointmentType) {
        case 'halfHour': {
          invariant(
            diff === 30,
            'Given the Appointment Type of Half Hour the start time must be 30 minutes after the end time'
          );
          break;
        }
        case 'fullHour': {
          invariant(
            diff === 60,
            'Given the Appointment Type of Full Hour the start time must be 60 minutes after the end time'
          );
          break;
        }
        case 'pair': {
          invariant(
            diff === 60,
            'Given the Appointment Type of Pair the start time must be 60 minutes after the end time'
          );
          break;
        }
      }
    }

    expectCorrectNumberOfClients(cmd) {
      switch (cmd.appointmentType) {
        case 'halfHour':
        case 'fullHour': {
          invariant(
            cmd.clients && cmd.clients.length === 1,
            `Given the Appointment Type of ${cmd.appointmentType} you must have 1 and only 1 client assigned`
          );
          break;
        }
        case 'pair': {
          invariant(
            cmd.clients && cmd.clients.length >= 2,
            `Given the Appointment Type of Pair you must have 2 or more clients assigned`
          );
          break;
        }
      }
    }

    expectTrainerNotConflicting(cmd) {
      let trainerConflict = this.appointments
        .filter(
          x =>
            (x.id &&
              x.id !== cmd.appointmentId &&
              moment(x.startTime).isBetween(cmd.startTime, cmd.endTime, 'minutes', '[]')) ||
            (x.id && x.id !== cmd.appointmentId && moment(x.endTime).isBetween(cmd.startTime, cmd.endTime, 'minutes')),
          '[]'
        )
        .filter(x => x.trainerId === cmd.trainerId);
      invariant(
        trainerConflict.length <= 0,
        `New Appointment conflicts with this Appointment: ${trainerConflict[0] && trainerConflict[0].id} 
                for this trainerId: ${cmd.trainerId}.`
      );
    }

    expectClientsNotConflicting(cmd) {
      let clientConflicts = this.appointments
        .filter(
          x =>
            (x.id &&
              x.id !== cmd.appointmentId &&
              moment(x.startTime).isBetween(cmd.startTime, cmd.endTime, 'minutes', '[]')) ||
            (x.id &&
              x.id !== cmd.appointmentId &&
              moment(x.endTime).isBetween(cmd.startTime, cmd.endTime, 'minutes', '[]'))
        )
        .filter(x => x.clients.includes(c => cmd.clients.includes(c2 => c.id === c2.id)));
      invariant(
        clientConflicts.length <= 0,
        `New Appointment conflicts with this Appointment: ${clientConflicts[0] && clientConflicts[0].id} 
                for at least one client.`
      );
    }
  };
};
