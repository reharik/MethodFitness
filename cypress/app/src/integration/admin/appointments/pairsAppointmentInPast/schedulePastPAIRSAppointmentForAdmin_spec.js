const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;

describe('Creating a PAIRS Appointment in the Past For Admin', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('clients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When creating an appointment unfunded for both pairs in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time13, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        pairsCount: -1,
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client2,
        pairsCount: -1,
      });

      routines.checkVerification({
        index: 2,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When creating an appointment unfunded for both pairs then funding it in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time13, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client2,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 2,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        pairHourCount: 1,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client2,
        pairCount: 1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 6,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 7,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 2,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When creating a pair appointment funded by both in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time14, true);

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client2,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        pairHourCount: 1,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client2,
        pairCount: 1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 6,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 7,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 2,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When creating an appointment unfunded for both pairs then funding it for one pair in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time13, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client2,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 2,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        pairHourCount: 1,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client2,
        pairCount: -1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 6,
        availableCount: 1,
        inArrearsCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
        inArrearsItemValues: [
          {
            client: this.clients.client2,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 7,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 1,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 1,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When creating a pair appointment funded by one in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time14, true);

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        pairHourCount: 1,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client2,
        pairCount: -1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 6,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 7,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 1,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 1,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });
});
