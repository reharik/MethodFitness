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
      this.sessions[item.sessionType].push(item);
      this.checkForInArrears(item);
    }

    sessionsVerified(sessions) {
      this.unpaidAppointments = this.unpaidAppointments
        .map(x => sessions.some(y => x.sessionId === y) ? Object.assign(x, {verified: true}) : x);
    }

    trainerPaid(sessions) {
      let paidAppointments = this.unpaidAppointments
        .filter(x => sessions.some(y => x.sessionId === y));
      this.unpaidAppointments = this.unpaidAppointments
        .filter(x => !sessions.some(y => x.sessionId === y));
      this.sessions.fullHour = this.sessions.fullHour
        .filter(x => !sessions.some(y => x.sessionId === y));
      this.sessions.halfHour = this.sessions.halfHour
        .filter(x => !sessions.some(y => x.sessionId === y));
      this.sessions.pair = this.sessions.pair
        .filter(x => !sessions.some(y => x.sessionId === y));
      paidAppointments.filter(x =>
          !this.unpaidAppointments.some(y => x.appointmentId === y.appointmentId )
          && !this.unfundedAppointments.some(y => x.appointmentId === y.appointmentId ))
        .forEach(x => this.appointments = this.appointments.filter(y => y.id !== x.appointmentId)); // eslint-disable-line
    }

    async processAppointment(appointmentId) {

      let appointment = this.appointments.find(x => x.id === appointmentId);
      if (!appointment || appointment.length <= 0) {
        return;
      }

      this.currentTrainer = appointment.trainerId;

      let curriedCreateUnpaidAppointment = this.curryCreateUnpaidAppointment(appointment);
      let curriedUseSession = this.curryUseSession(appointment);
      let curriedHandleInArrears = this.curryHandleInArrears(appointment);
      let curriedFilterClientsWhoPaidForThisAppointment = this.curryFilterClientsWhoPaidForThisAppointment(appointment);

      let newItems = appointment.clients
        .filter(x => curriedFilterClientsWhoPaidForThisAppointment(x))
        .map(x => curriedCreateUnpaidAppointment(x))
        .map(x => curriedUseSession(x))
        .map(x => curriedHandleInArrears(x));

      this.unpaidAppointments = this.unpaidAppointments.concat(newItems.filter(x => x.funded));
    }

    curryFilterClientsWhoPaidForThisAppointment(appointment) {
      return clientId => {
        return !this.unpaidAppointments.find(y =>
        y.clientId === clientId
        && y.appointmentId === appointment.id
        && y.funded);
      };
    }

    curryCreateUnpaidAppointment(appointment) {
      return clientId => {
        let client = this.clients.find(c => c.id === clientId);
        let session = this.sessions[appointment.appointmentType]
          .filter(a => clientId === a.clientId
          && !a.used)[0];
        let trainer = this.trainers.find(x => x.id === appointment.trainerId);

        let TCR = trainer.TCRS.find(tcr => tcr.clientId === clientId);
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
          sessionId: session ? session.sessionId : 0,
          pricePerSession: session ? session.purchasePrice : 0,
          trainerPercentage: TCR ? TCR.rate : 0,
          trainerPay: TR,
          verified: false,
          funded: !!session
        };
      };
    }

    curryUseSession(appointment) {
      return item => {
        if (!item.funded) {
          return item;
        }

        this.sessions[appointment.appointmentType] =
          this.sessions[appointment.appointmentType]
            .map(x => item.sessionId === x.sessionId ? Object.assign(x, {used: true}) : x);
        return item;
      };
    }

    curryHandleInArrears(appointment) {
      return item => {
        if (!item.funded) {
          this.unfundedAppointments.push(item);
        } else {
          this.unfundedAppointments = this.unfundedAppointments
            .filter(uf =>
            uf.clientId !== item.clientId
            || uf.appointmentId !== appointment.id
            || uf.appointmentType !== appointment.appointmentType);
        }
        return item;
      };
    }

    checkForInArrears(event) {
      const inArrears = this.unfundedAppointments
        .filter(x => x.clientId === event.clientId && x.appointmentType === event.sessionType);

      if (inArrears && inArrears.length > 0) {
        this.processAppointment(inArrears[0].appointmentId);
      }
    }

    getDisplayResult() {
      return this.unpaidAppointments.concat(this.unfundedAppointments);
    }
  };
};
