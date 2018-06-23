const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating an Appointment in the Past Changing Client and Type', () => {
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

  describe('When changing Client and Type on unfunded to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time7, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour'
      });

      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
        appointmentType: 'Half Hour'
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: '0',
        halfHourCount: '0',
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client2,
        halfHourCount: '-1',
      });

      routines.checkVerification({
        index: 3,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });
    });
  });

  describe('When changing Client and Type on unfunded to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time7, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        halfHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour'
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
        appointmentType: 'Half Hour'
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '0',
        halfHourCount: '0',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        halfHourCount: '1',
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });

      routines.verifyAppointments({
        index: 6
      });

      routines.checkPayTrainer({
        index: 7,
        trainer: this.trainers.trainer1,
        payableCount: 1
      });

      routines.payTrainer({
        index: 8,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 9,
        appointmentCount: 1,
        appointmentValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });
    });
  });

  describe('When changing Client and Type on funded to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time8, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour'
      });

      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
        appointmentType: 'Half Hour'
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: '2',
        halfHourCount: '0'
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client2,
        halfHourCount: '-1'
      });

      routines.checkVerification({
        index: 3,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });
    });
  });

  describe('When changing Client and Type on funded to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time8, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        halfHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour'
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
        appointmentType: 'Half Hour'
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '0',
        halfHourCount: '1',
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });

      routines.verifyAppointments({
        index: 6
      });

      routines.checkPayTrainer({
        index: 7,
        trainer: this.trainers.trainer1,
        payableCount: 1
      });

      routines.payTrainer({
        index: 8,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 9,
        appointmentCount: 1,
        appointmentValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour'
        }
      });
    });
  });
});
