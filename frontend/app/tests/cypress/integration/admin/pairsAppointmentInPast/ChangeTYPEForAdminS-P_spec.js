const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating a Pairs Appointment in the Past Changing Appointment Type', () => {
  let routines;

  beforeEach(() => {
    setupRoutes(cy);
    routines = _routines(cy, Cypress, Cypress.moment);

    routines.loginAdmin({});
    routines.deleteAllAppointments();
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('clients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When changing apointmentType S -> P before funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Pair',
        currentClient: this.clients.client1,
        client2: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '0',
        pairCount: '-1',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '-1',
      });

      routines.checkVerification({
        index: 4,
        inarrearsCount: 2,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
        inarrearsItemValues2: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: '2',
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client2,
        pairCount: '2',
      });

      routines.checkClientInventory({
        index: 6,
        client: this.clients.client1,
        pairCount: '1',
      });

      routines.checkClientInventory({
        index: 6,
        client: this.clients.client2,
        pairCount: '1',
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
        availableItemValues2: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Pair',
        },
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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
        appointmentValues2: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });
    });
  });

  describe('When changing apointmentType S -> P after funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time11, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Pair',
        currentClient: this.clients.client1,
        client2: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2',
        pairCount: '-1',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '0',
        pairCount: '-1',
      });

      routines.checkSessions({
        index: 4,
        client: this.clients.client1,
        availableCount: 2,
      });

      routines.checkVerification({
        index: 5,
        inarrearsCount: 2,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
        inarrearsItemValues2: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });
    });
  });

  describe('When changing apointmentType S -> P after funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
        pairCount: '2',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        pairCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Pair',
        currentClient: this.clients.client1,
        client2: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2',
        pairCount: '1',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '1',
      });
      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 3,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
        availableItemValues2: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Pair',
        },
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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
        appointmentValues2: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });
    });
  });

  describe('When changing apointmentType S -> P after funded -> 1 funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
        pairCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Pair',
        currentClient: this.clients.client1,
        client2: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2',
        pairCount: '1',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '-1',
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 3,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Pair',
        },
      });
    });
  });
});
