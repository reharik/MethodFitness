module.exports = function(invariant) {
  return class TrainerPayments {
    constructor(state = {}) {
      this.id = state.id || '00000000-0000-0000-0000-000000000001';
      this.clients = state.clients || [];
      this.trainers = state.trainers || [];
      this.appointments = state.appointments || [];
      this.sessions = {
        fullHour: state.sessions && state.sessions.fullHour || [],
        halfHour: state.sessions && state.sessions.halfHour || [],
        pair: state.sessions && state.sessions.pair || []
      };
      this.paidAppointments = state.paidAppointments || [];
    }

    addTrainer(trainer) {
      this.trainers.push(trainer);
    }

    addClient(client) {
      this.clients.push(client);
    }

    addTRC(trainerId, item) {
      let trainer = this.trainers.find(x => x.id === trainerId);
      invariant(trainer, `Unable to find trainer with ID: ${trainerId}`);
      trainer.TCRS.push(item);
    }

    updateTRC(item) {
      this.trainers = this.trainers.map(x => {
        if (x.id === item.trainerId) {
          x.TCRS.map(c => c.clientId === item.clientId ? Object.assign(c, { rate: item.rate }) : c);
          return x;
        }
        return x;
      });
    }

    removeTCR(item) {
      this.trainers = this.trainers.map(x => {
        if (x.id === item.trainerId) {
          x.TCRS.filter(c => c.clientId !== item.clientId);
          return x;
        }
        return x;
      });
    }

    addAppointment(item) {
      this.appointments.push(item);
    }

    updateScheduledAppointment(item) {
      this.appointments = this.appointments.map(x =>
        x.id === item.id
          ? item
          : x);
    }

    removeAppointment(item) {
      this.appointments = this.appointments.filter(x => x.id !== item.id);
    }

    addSession(item) {
      if (!item.used) {
        this.sessions[item.appointmentType].push(item);
      }
    }

    cleanUp() {
      this.paidAppointments.forEach(x => {
        let appointment = this.appointments.find(a => a.id === x.appointmentId);
        // remove appointment
        if (appointment.appointmentType !== 'pair' || appointment.clients.length === 1) {
          this.appointments = this.appointments.filter(a => a.id !== appointment.id);
        }
        // remove paid client from pair
        if (appointment.appointmentType === 'pair') {
          appointment.clients = appointment.clients.filter(c => c.id !== x.clientId);
        }

        this.sessions[x.appointmentType] = this.sessions[x.appointmentType]
          .filter(s => s.id !== x.sessionId);
      });
    }

    processPaidAppointments(event) {
      event.paidAppointments.forEach(x => {
        this.paidAppointments.push(this.createPaidAppointment(x));
      });
      this.cleanUp(event.paidAppointments);
    }

    createPaidAppointment(item) {
      let appointment = this.appointments.find(x => x.id === item.appointmentId);
      let session = this.sessions[appointment.appointmentType]
        .find(s => s.sessionId === item.sessionId);

      let client = this.clients.find(c => c.id === session.clientId);

      let trainer = this.trainers.find(x => x.id === appointment.trainerId);

      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.id);
      let TR = 0;
      if (session && TCR) {
        TR = session.purchasePrice * (TCR.rate * .01);
      }

      return {
        trainerId: trainer.id,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.id,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType,
        sessionId: session.sessionId,
        pricePerSession: session.purchasePrice,
        //possibly set this to default TCR if 0
        trainerPercentage: TCR ? TCR.rate : 0,
        trainerPay: TR
      };
    }
  };
};
