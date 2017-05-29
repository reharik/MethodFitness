module.exports = function(rsRepository, moment, UnpaidAppointments, logger) {
  return class UnpaidAppointmentsEventHandler {
    constructor() {
      this.upa = {};
      this.handlerType = this.handlerName = 'unpaidAppointmentsMeta';
    }

    async initialize() {
      logger.info('UnpaidAppointmentsEventHandler started up');
      let state = await rsRepository
        .getAggregateView('unpaidAppointments', '00000000-0000-0000-0000-000000000001');
      if (!state) {
        this.upa = new UnpaidAppointments();
        await rsRepository.insertAggregateView('unpaidAppointments', this.upa, this.upa.unpaidAppointments);
      } else {
        this.upa = new UnpaidAppointments(state);
      }
    }

    async saveView(trainerId) {
      let payload = this.upa.unpaidAppointments
        .concat(this.upa.unfundedAppointments)
        .filter(x => x.trainerId === trainerId);
      return await rsRepository.saveAggregateView(
        'unpaidAppointments',
        this.upa,
        payload,
        trainerId);
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
        trainer: event.trainer,
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
        trainer: event.trainer,
        clients: event.clients
      });

      return await this.saveView();
    }

    async appointmentCanceled(event) {
      this.upa.removeAppointment(event.id);
      return await this.saveView();
    }

    async fullHourSessionPurchased(event) {
      this.upa.addSession(event);
      return await this.saveView(x => x.trainerId === this.upa.currentTrainer);
    }

    async halfHourSessionPurchased(event) {
      this.upa.addSession(event);
      return await this.saveView();
    }

    async pairSessionPurchased(event) {
      this.upa.addSession(event);
      return await this.saveView();
    }

    async appointmentAttendedByClient(event) {
      this.upa.processAppointment(event.appointmentId);
      return await this.saveView();
    }
  };
};
