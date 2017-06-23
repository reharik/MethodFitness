module.exports = function(rsRepository, moment, TrainerPaymentDetails, logger) {
  return class trainerPaymentDetailsEventHandler {
    constructor() {
      this.tpd = {};
      this.handlerType = this.handlerName = 'trainerPaymentDetailsMeta';
    }

    async initialize() {
      logger.info('trainerPaymentDetails started up');
      let state = await rsRepository
        .getAggregateViewMeta('trainerPaymentDetails', '00000000-0000-0000-0000-000000000001');

      if (!state.trainers) {
        this.tpd = new TrainerPaymentDetails();

        await rsRepository.insertAggregateMeta('trainerPaymentDetails', this.tpd);
      } else {
        this.tpd = new TrainerPaymentDetails(state);
      }
    }

    async saveView(paymentId, trainerId) {
      let trainerPaymentDetails = {};
      if (trainerId) {
        trainerPaymentDetails = rsRepository.getById(trainerId, 'trainerPaymentDetails');
        if (!trainerPaymentDetails.trainerId) {
          trainerPaymentDetails = { id: trainerId, payments: [] };
        }
        trainerPaymentDetails.payments.push({
          paymentId,
          paymentDate: moment().toISOString(),
          paidAppointments: this.tpd.paidAppointments,
          paymentTotal: this.tpd.paidAppointments.reduce((a,b) => a + b.trainerPay, 0)
        });
      }
      return await rsRepository.saveAggregateView(
        'trainerPaymentDetails',
        this.tpd,
        trainerPaymentDetails);
    }

    async trainerHired(event) {
      this.tpd.addTrainer({ id: event.id, TCRS: [] });

      return await this.saveView();
    }

    async clientAdded(event) {
      this.tpd.addClient({
        id: event.id,
        firstName: event.contact.firstName,
        lastName: event.contact.lastName
      });

      return await this.saveView();
    }

    async trainersNewClientRateSet(event) {
      this.tpd.addTRC(event.trainerId, {clientId: event.clientId, rate: event.rate});

      return await this.saveView();
    }

    async trainersClientRateChanged(event) {
      this.tpd.updateTCR(event);

      return await this.saveView();
    }

    async trainerClientRemoved(event) {
      this.tpd.removeTCR(event);

      return await this.saveView();
    }

    async appointmentScheduled(event) {
      this.tpd.addAppointment({
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
      this.tpd.updateScheduledAppointment({
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
      this.tpd.removeAppointment(event.id);
      return await this.saveView();
    }

    async sessionsPurchased(event) {
      event.sessions.forEach(e => this.tpd.addSession(e));
      return await this.saveView();
    }

    async trainerPaid(event) {
      console.log(`==========event=========`);
      console.log(event);
      console.log(`==========END event=========`);

      this.tpd.processPaidAppointments(event);
      return await this.saveView(event.paymentId, event.trainerId);
    }
  };
};
