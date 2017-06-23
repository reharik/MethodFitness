module.exports = function(rsRepository, moment, UnpaidAppointments, logger) {
  return class UnpaidAppointmentsEventHandler {
    constructor() {
      this.upa = {};
      this.handlerType = this.handlerName = 'unpaidAppointmentsMeta';
    }

    async initialize() {
      logger.info('UnpaidAppointmentsEventHandler started up');
      let state = await rsRepository
        .getAggregateViewMeta('unpaidAppointments', '00000000-0000-0000-0000-000000000001');
      if (!state.trainers) {
        this.upa = new UnpaidAppointments();

        await rsRepository.insertAggregateMeta(
          'unpaidAppointments',
          this.upa);
      } else {
        this.upa = new UnpaidAppointments(state);
      }
    }

    async saveView(trainerId) {
      let document = {};
      if (trainerId) {
        let unpaidAppointments = this.upa.unpaidAppointments
          .concat(this.upa.unfundedAppointments)
          .filter(x => x.trainerId === trainerId);

        document.id = trainerId;
        document.unpaidAppointments = unpaidAppointments;
      }
      return await rsRepository.saveAggregateView(
        'unpaidAppointments',
        this.upa,
        document);
    }

    async trainerHired(event) {
      this.upa.addTrainer({ id: event.id, TCRS: [] });

      return await this.saveView();
    }

    async clientAdded(event) {
      this.upa.addClient({
        id: event.id,
        firstName: event.contact.firstName,
        lastName: event.contact.lastName
      });

      return await this.saveView();
    }

    async trainersNewClientRateSet(event) {
      this.upa.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await this.saveView();
    }

    async trainersClientRateChanged(event) {
      this.upa.updateTCR(event);

      return await this.saveView();
    }

    async trainerClientRemoved(event) {
      this.upa.removeTCR(event);

      return await this.saveView();
    }

    async appointmentScheduled(event) {
      this.upa.addAppointment({
        id: event.id,
        appointmentType: event.appointmentType,
        date: event.date,
        startTime: event.startTime,
        trainerId: event.trainerId,
        clients: event.clients
      });

      return await this.saveView();
    }

    async appointmentUpdated(event) {
      this.upa.updateScheduledAppointment({
        id: event.id,
        appointmentType: event.appointmentType,
        date: event.date,
        startTime: event.startTime,
        trainerId: event.trainerId,
        clients: event.clients
      });

      return await this.saveView();
    }

    async appointmentCanceled(event) {
      this.upa.removeAppointment(event.id);
      return await this.saveView();
    }

    async sessionsPurchased(event) {
      event.sessions.forEach(e => this.upa.addSession(e));
      return await this.saveView(this.upa.currentTrainer);
    }

    async appointmentAttendedByClient(event) {
      this.upa.processFundedAppointment(event);
      return await this.saveView(this.upa.currentTrainer);
    }

    async appointmentAttendedByUnfundedClient(event) {
      this.upa.processUnfundedAppointment(event);
      return await this.saveView(this.upa.currentTrainer);
    }

    async unfundedAppointmentFundedByClient(event) {
      this.upa.processNewlyFundedAppointment(event);
      return await this.saveView(this.upa.currentTrainer);
    }

    async trainerVerifiedAppointments(event) {
      this.upa.sessionsVerified(event.sessionIds);
      return await this.saveView(event.trainerId);
    }

    async trainerPaid(event) {
      this.upa.trainerPaid(event.paidAppointments);
      return await this.saveView(event.trainerId);
    }
  };
};
