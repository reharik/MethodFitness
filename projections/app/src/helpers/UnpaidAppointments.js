module.exports = function(invariant) {
  return class UnpaidAppointments {
    constructor(state = {}) {
      this.id = state.id || '00000000-0000-0000-0000-000000000001';
      this.clients = state.clients || [];
      this.trainers = state.trainers || [];
      this.appointments = state.appointments || [];
      this.sessions = {
        fullHour: state.sessions && state.sessions.fullHour || [],
        halfHour: state.sessions && state.sessions.halfHour || [],
        pair: state.sessions && state.sessions.pair || []};
      this.unfundedAppointments = state.unfundedAppointments || [];
      this.unpaidAppointments = state.unpaidAppointments || [];
      this.currentTrainer = 0;
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
          x.TCRS.map(c => c.clientId === item.clientId ? Object.assign(c, {rate: item.rate}) : c);
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

    sessionsVerified(sessions) {
      this.unpaidAppointments = this.unpaidAppointments
        .map(x => sessions.some(y => x.sessionId === y) ? Object.assign(x, {verified: true}) : x);
    }

    trainerPaid(sessions) {
      this.paidAppointments = this.unpaidAppointments
        .filter(x => sessions.some(y => x.sessionId === y.sessionId));

      this.unpaidAppointments = this.unpaidAppointments
        .filter(x => !sessions.some(y => x.sessionId === y.sessionId));

      this.sessions.fullHour = this.sessions.fullHour
        .filter(x => !sessions.some(y => x.sessionId === y.sessionId));
      this.sessions.halfHour = this.sessions.halfHour
        .filter(x => !sessions.some(y => x.sessionId === y.sessionId));
      this.sessions.pair = this.sessions.pair
        .filter(x => !sessions.some(y => x.sessionId === y.sessionId));

      this.paidAppointments.filter(x =>
          !this.unpaidAppointments.some(y => x.appointmentId === y.appointmentId )
          && !this.unfundedAppointments.some(y => x.appointmentId === y.appointmentId ))
        .forEach(x => this.appointments = this.appointments.filter(y => y.id !== x.appointmentId)); // eslint-disable-line

    }

    processFundedAppointment(event) {
      let appointment = this.appointments.find(x => x.id === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return;
      }

      this.currentTrainer = appointment.trainerId;
      this.unpaidAppointments.push(this.createUnpaidAppointment(appointment, event));
    }

    processUnfundedAppointment(event) {
      let appointment = this.appointments.find(x => x.id === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return;
      }

      this.currentTrainer = appointment.trainerId;
      this.unfundedAppointments.push(this.createUnfundedAppointment(appointment, event));
    }

    processNewlyFundedAppointment(event) {
      let appointment = this.appointments.find(x => x.id === event.appointmentId);
      if (!appointment || appointment.length <= 0) {
        return;
      }

      this.currentTrainer = appointment.trainerId;
      this.unfundedAppointments.filter(x => x.appointmentId !== event.appointmentId && x.clientId !== event.clientId);
      this.unpaidAppointments.push(this.fundUnfundedAppointment(event, appointment));
    }

    fundUnfundedAppointment(event, appointment) {
      let unfunded = this.unfundedAppointments
        .find(x => x.appointmentId === event.appointmentId && x.clientId === event.clientId);
      let client = this.clients.find(c => c.id === event.clientId);
      let trainer = this.trainers.find(x => x.id === appointment.trainerId);
      let TCR = trainer.TCRS.find(tcr => tcr.clientId === client.id);
      let TR = TCR ? event.purchasePrice * (TCR.rate * .01) : 0;
      unfunded.sessionId = event.sessionId;
      unfunded.pricePerSession = event.purchasePrice;
      //possibly set this to default TCR if 0
      unfunded.trainerPercentage = TCR ? TCR.rate : 0;
      unfunded.trainerPay = TR;
      unfunded.verified = false;
      return unfunded;
    }

    createUnpaidAppointment(appointment, event) {
      let client = this.clients.find(c => c.id === event.clientId);
      let session = this.sessions[appointment.appointmentType]
        .find(s => s.sessionId === event.sessionId);

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
        trainerPay: TR,
        verified: false
      };
    }

    createUnfundedAppointment(appointment, event) {
      let client = this.clients.find(c => c.id === event.clientId);
      let trainer = this.trainers.find(x => x.id === appointment.trainerId);
      return {
        trainerId: trainer.id,
        clientId: client.id,
        clientName: `${client.firstName} ${client.lastName}`,
        appointmentId: appointment.id,
        appointmentDate: appointment.date,
        appointmentStartTime: appointment.startTime,
        appointmentType: appointment.appointmentType
      };
    }
  };
};
