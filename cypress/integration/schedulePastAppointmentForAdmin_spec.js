const _routines = require('./../helpers/routines');
const setupRoutes = require('./../helpers/setupRoutes');
const _aDT = require('./../fixtures/appointments');
let aDT;

describe('Creating an Appointment in the Past For Admin', () => {
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

  describe('When creating an unfunded appointment in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '7:00 AM', true);
      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '-1'
      });

      routines.checkVerification({
        index: 2,
        inarearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      routines.checkClientInventory({
        index: 4,
        client:this.clients.client1,
        fullHourCount: '1'
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.checkVerification({
        index: 6,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
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
        client: this.clients.client1,
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

    });
  });

  describe('When creating an funded appointment in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, '8:00 AM', true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');
      cy.createAppointment(aDT.date, aDT.time, this.clients.client1, 'Full Hour');

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: '1'
      });

      routines.checkSessions({
        index: 3,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 5
      });

      routines.checkPayTrainer({
        index: 6,
        trainer: this.trainers.trainer1,
        payableCount: 1
      });

      routines.payTrainer({
        index: 7,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 8,
        client: this.clients.client1,
        appointmentCount: 1,
        appointmentValues: {
          date: aDT.date,
          appointmentType: 'Full Hour'
        }
      });

      routines.refundSessions({
        index: 9,
        client: this.clients.client1
      });
    });

  });
});