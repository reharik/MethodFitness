module.exports = function(rsRepository, moment, TrainerPayments, logger) {
  return class trainerPaymentsEventHandler {
    constructor() {
      this.tp = {};
      this.handlerType = this.handlerName = 'trainerPaymentsMeta';
    }

    async initialize() {
      logger.info('trainerPayments started up');
      let state = await rsRepository
        .getAggregateViewMeta('trainerPayments', '00000000-0000-0000-0000-000000000001');
      if (!state.trainers) {
        this.tp = new TrainerPayments();

        await rsRepository.insertAggregateMeta(
          'trainerPayments',
          this.tp);
      } else {
        this.tp = new TrainerPayments(state);
      }
    }

    async saveView(trainerId) {
      let trainerPayments = {};
      if (trainerId) {
        trainerPayments = rsRepository.getById(trainerId, 'trainerPayments');
        if (!trainerPayments.trainerId) {
          trainerPayments = { id: trainerId, payments: [] };
        }
        trainerPayments.payments.push({[moment().toISOString()]: this.tp.paidAppointments});
      }
      return await rsRepository.saveAggregateView(
        'trainerPayments',
        this.tp,
        trainerPayments);
    }

    async trainerHired(event) {
      this.tp.addTrainer({ id: event.id, TCRS: [] });

      return await this.saveView();
    }

    async clientAdded(event) {
      this.tp.addClient({
        id: event.id,
        firstName: event.contact.firstName,
        lastName: event.contact.lastName
      });

      return await this.saveView();
    }

    async trainersNewClientRateSet(event) {
      this.tp.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await this.saveView();
    }

    async trainersClientRateChanged(event) {
      this.tp.updateTCR(event);

      return await this.saveView();
    }

    async trainerClientRemoved(event) {
      this.tp.removeTCR(event);

      return await this.saveView();
    }

    async appointmentScheduled(event) {
      this.tp.addAppointment({
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
      this.tp.updateScheduledAppointment({
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
      this.tp.removeAppointment(event.id);
      return await this.saveView();
    }

    async fullHourSessionPurchased(event) {
      this.tp.addSession(event);
      return await this.saveView();
    }

    async halfHourSessionPurchased(event) {
      this.tp.addSession(event);
      return await this.saveView();
    }

    async pairSessionPurchased(event) {
      this.tp.addSession(event);
      return await this.saveView();
    }

    async trainerPaid(event) {
      console.log(`==========event=========`);
      console.log(event);
      console.log(`==========END event=========`);

      this.tp.processPaidAppointments(event);
      return await this.saveView(event.trainerId);
    }
  };
};
