const _routines = require('./../helpers/routines');
const setupRoutes = require('./../helpers/setupRoutes');
const _aDT = require('./../fixtures/appointments');
let aDT;
let appointmentValues;

describe('Creating an Appointment in the Past Changing Date, Client and Type', () => {
  let routines;

  beforeEach(() => {
    setupRoutes(cy);
    routines = _routines(cy, Cypress.moment);

    cy.loginAdmin();
    cy.visit('/');
    cy.deleteAllAppointments();
    cy.get('.redux__task__calendar__header__date__nav > :nth-child(1)').click();
    cy.deleteAllAppointments();
    cy.get('.redux__task__calendar__header__date__nav > :nth-child(2)').click();
    cy.wait(500);
    cy.get('.redux__task__calendar__header__date__nav > :nth-child(2)').click();
    cy.deleteAllAppointments();
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('clients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When changing Date, Client and Type on unfunded to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '7:00 PM', true);
      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate: newDate,
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
        inarearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Half Hour'
        }
      });
    });
  });

  describe('When changing Date, Client and Type on unfunded to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '7:00 PM', true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        halfHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate,
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
          date: newDate,
          appointmentType: 'Half Hour'
        }
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: newDate,
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
        client: this.clients.client2,
        appointmentCount: 1,
        appointmentValues: {
          date: newDate,
          appointmentType: 'Half Hour'
        }
      });

      routines.refundSessions({
        index: 10,
        client: this.clients.client2
      });
    });
  });

  describe('When changing Date, Client and Type on funded to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '8:00 PM', true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate: newDate,
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
        inarearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Half Hour'
        }
      });

      routines.refundSessions({
        index: 10,
        client: this.clients.client1
      });
    });
  });

  describe('When changing Date, Client and Type on funded to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '8:00 PM', true);

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

      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate,
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
          date: newDate,
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
          date: newDate,
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
        client: this.clients.client2,
        appointmentCount: 1,
        appointmentValues: {
          date: newDate,
          appointmentType: 'Half Hour'
        }
      });

      routines.refundSessions({
        index: 10,
        client: this.clients.client1
      });

      routines.refundSessions({
        index: 11,
        client: this.clients.client2
      });
    });

  });
});
