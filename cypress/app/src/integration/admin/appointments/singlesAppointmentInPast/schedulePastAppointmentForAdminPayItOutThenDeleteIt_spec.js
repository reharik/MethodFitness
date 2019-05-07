const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;

describe('Creating an Appointment in the Past For Admin', () => {
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

  describe('When creating an unfunded appointment in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time13, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        fullHourCount: -1,
      });

      routines.checkVerification({
        index: 2,
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Full Hour',
          },
        ],
      });

      routines.purchaseSessions({
        index: 3,
        client: this.clients.client1,
        fullHourCount: 2,
      });

      routines.checkClientInventory({
        index: 4,
        client: this.clients.client1,
        fullHourCount: 1,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkVerification({
        index: 6,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Full Hour',
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
            appointmentType: 'Full Hour',
          },
        ],
      });
    });
  });

  describe('When creating an funded appointment in the past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time14, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: 1,
      });

      routines.checkSessions({
        index: 3,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemsValues: [
          {
            date: aDT.date,
            appointmentType: 'Full Hour',
          },
        ],
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Full Hour',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 5,
      });

      routines.checkPayTrainer({
        index: 6,
        trainer: this.trainers.trainer1,
        payableCount: 1,
      });

      routines.payTrainer({
        index: 7,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 8,
        appointmentCount: 1,
        appointments: [
          {
            client: this.clients.client1,
            date: aDT.date,
            appointmentType: 'Full Hour',
          },
        ],
      });
      routines.deleteAppointment({
        index: 9,
        date: aDT.date,
        time: aDT.time,
      });
      routines.checkSessions({
        index: 10,
        client: this.clients.client1,
        availableCount: 2,
        usedCount: 0,
      });
    });
  });
});
