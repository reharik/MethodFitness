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
      this.sessions[item.appointmentType].push(item);
      this.checkForInArrears(item);
    }

    async processAppointment(appointmentId) {
      let appointment = this.appointments.find(x => x.id === appointmentId);
      if (!appointment || appointment.length <= 0) {
        return;
      }

      let curriedCreateUnpaidAppointment = this.curryCreateUnpaidAppointment(appointment);
      let curriedSubtractSession = this.currySubtractSession(appointment);
      let curriedHandleInArrears = this.curryHandleInArrears(appointment);
      let curriedFilterClientsWhoPaidForThisAppointment = this.curryFilterClientsWhoPaidForThisAppointment(appointment);

      let newItems = appointment.clients
        .filter(x => curriedFilterClientsWhoPaidForThisAppointment(x))
        .map(x => curriedCreateUnpaidAppointment(x))
        .map(x => curriedSubtractSession(x))
        .map(x => curriedHandleInArrears(x));

      this.unpaidAppointments = this.unpaidAppointments.concat(newItems.filter(x => !x.funded));
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
          .filter(a => clientId === a.id)[0];

        let trainer = this.trainers.find(x => x.id === appointment.trainer);
        let TCR = trainer.TCRS.find(tcr => tcr.clientId === clientId);
        let TR = 0;
        if (session && TCR) {
          TR = session.purchasePrice * (TCR * .01);
        }

        return {
          trainerId: trainer.id,
          clientId: client.id,
          sessionId: session ? session.id : 0,
          appointmentId: appointment.id,
          clientName: `${client.firstName} ${client.lastName}`,
          appointmentDate: appointment.date,
          appointmentType: appointment.appointmentType,
          pricePerSession: session ? session.purchasePrice : 0,
          trainerPercentage: TCR ? TCR.rate : 0,
          trainerPay: TR,
          verified: false,
          funded: !!session
        };
      };
    }

    currySubtractSession(appointment) {
      return item => {
        if (!item.funded) {
          return item;
        }
        this.sessions[appointment.appointmentType] =
          this.sessions[appointment.appointmentType]
            .filter(x => !item.sessionId === x.id);
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
