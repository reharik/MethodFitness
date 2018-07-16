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

  describe('When changing apointmentType P -> S before funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Full Hour',
        removeClient: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '-1',
        pairCount: '0',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '0',
        pairCount: '0',
      });

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      routines.checkClientInventory({
        index: 6,
        client: this.clients.client1,
        fullHourCount: '1',
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
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
          appointmentType: 'Full Hour',
        },
      });
    });
  });

  describe('When changing apointmentType P -> S after funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
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

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Full Hour',
        removeClient: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '-1',
        pairCount: '2',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '0',
        pairCount: '2',
      });

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 2,
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 2,
      });
    });
  });

  describe('When changing apointmentType P -> S after funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: '2',
        fullHourCount: '2',
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client2,
        pairCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Full Hour',
        removeClient: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '1',
        pairCount: '2',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '0',
        pairCount: '2',
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 3,
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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });
    });
  });

  describe('When changing apointmentType P -> S after funded for 1 -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: '2',
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Full Hour',
        removeClient: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '1',
        pairCount: '2',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '0',
        pairCount: '0',
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 3,
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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });
    });
  });
});
