module.exports = function(AggregateRootBase, invariant, uuid, moment) {
  return class Appointment extends AggregateRootBase {
    constructor() {
      super();
      this.type = 'Appointment';
    }

    static aggregateName() {
      return 'Appointment';
    }

    commandHandlers() {
      this.expectEndTimeAfterStart();
      this.expectAppointmentDurationCorrect();
      this.expectCorrectNumberOfClients();

      return {
        scheduleAppointment: function(cmd) {
          this.raiseEvent({
            eventName: 'appointmentScheduled',
            id: uuid.v4(),
            appointmentType: cmd.appt.appointmentType,
            date: cmd.appt.date,
            startTime: cmd.appt.startTime,
            endTime: cmd.appt.endTime,
            trainer: cmd.appt.trainer,
            clients: cmd.appt.clients,
            notes: cmd.appt.notes,
            entityName: cmd.id
          });
        }
      };
    }

    applyEventHandlers() {
      return {
        appointmentScheduled: function(event) {
          this._id = event.data.id;
          this.appointmentType = event.appointmentType;
          this.startTime = event.startTime;
          this.endTime = event.endTime;
          this.trainer = event.trainer;
          this.clients = event.clients;
        }.bind(this)
      };
    }

    expectEndTimeAfterStart() {
      invariant(
        moment(this.startTime).isAfter(moment(this.endTime)),
        'Appointment End Time must be after Appointment Start Time'
      );
    }

    expectAppointmentDurationCorrect() {
      var diff = moment(this.startTime).diff(moment(this.endTime), 'minutes');
      switch (this.appointmentType) {
        case 'halfHour': {
          invariant(
            diff != 30,
            'Given the Appointment Type of Half Hour the start time must be 30 minutes after the end time'
          );
          break;
        }
        case 'fullHour': {
          invariant(
            diff != 60,
            'Given the Appointment Type of Full Hour the start time must be 60 minutes after the end time'
          );
          break;
        }
        case 'pair': {
          invariant(
            diff != 60,
            'Given the Appointment Type of Pair the start time must be 60 minutes after the end time'
          );
          break;
        }
      }
    }

    expectCorrectNumberOfClients() {
      switch (this.appointmentType) {
        case 'halfHour':
        case 'fullHour': {
          invariant(
            !clients || clients.length != 1,
            `Given the Appointment Type of ${this.appointmentType} you must have 1 and only 1 client assigned`
          );
          break;
        }
        case 'pair': {
          invariant(
            !clients || clients.length <= 1,
            `Given the Appointment Type of Pair you must have 2 or more clients assigned`
          );
          break;
        }
      }
    }
  };
};
