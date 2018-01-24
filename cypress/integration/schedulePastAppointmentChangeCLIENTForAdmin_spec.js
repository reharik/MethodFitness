const _routines = require('./../helpers/routines');
const setupRoutes = require('./../helpers/setupRoutes');
const _aDT = require('./../fixtures/appointments');
let aDT;
let appointmentValues;

describe('Creating an Appointment in the Past Changing Appointment Client', () => {
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

  describe('When changing from unfunded client to unfunded client', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '12:00 PM', true);
      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,

      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: '0'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '-1'
      });

      routines.checkVerification({
        index: 4,
        inarearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

    });
  });

  describe('When changing from unfunded client to funded client', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '12:00 PM', true);
      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      routines.purchaseSessions({
        index:1,
        client: this.clients.client2,
        fullHourCount: '2'
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,

      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '0'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        fullHourCount: '1'
      });

      routines.checkVerification({
        index: 5,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

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
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.refundSessions({
        index: 10,
        client: this.clients.client2
      });

    });
  });

  describe('When changing from funded client to unfunded client', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '1:00 PM', true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,

      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client2,
        fullHourCount: '-1'
      });

      routines.checkVerification({
        index: 5,
        inarearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.refundSessions({
        index: 11,
        client: this.clients.client1
      });

    });
  });

  describe('When changing from funded client to funded client', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '1:00 PM', true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      routines.purchaseSessions({
        index: 2,
        client: this.clients.client2,
        fullHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        currentClient: this.clients.client1,
        newClient: this.clients.client2
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      routines.checkClientInventory({
        index: 5,
        client: this.clients.client2,
        fullHourCount: '1'
      });

      routines.checkVerification({
        index: 6,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 7
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 1
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 10,
        client: this.clients.client2,
        appointmentCount: 1,
        appointmentValues: {
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.refundSessions({
        index: 11,
        client: this.clients.client1
      });

      routines.refundSessions({
        index: 12,
        client: this.clients.client2
      });

    });
  });

});