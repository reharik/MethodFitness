const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating a Pairs Appointment in the Past Changing One Client', () => {
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

  describe('When changing one client unfunded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client2,
        newClient: this.clients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: 0,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client4,
        pairCount: 2,
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When changing one client after funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
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

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client2,
        newClient: this.clients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: 1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 2,
      });

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 1,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
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

  describe('When changing one client after funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client2,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client4,
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

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client2,
        newClient: this.clients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: 1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client4,
        pairCount: 1,
      });

      routines.checkVerification({
        index: 4,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client4,
        availableCount: 1,
      });

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When changing one client after verified -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
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

      routines.verifyAppointments({
        index: 9,
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client2,
        newClient: this.clients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: 1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 2,
      });

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 1,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
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
