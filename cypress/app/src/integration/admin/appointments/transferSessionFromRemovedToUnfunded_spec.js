const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;

describe('Transfer Session From Removed Appointment To Unfunded Appointment', () => {
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

  describe('When Transfering Session From Removed Appointment To Unfunded Appointment', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: 1,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 2,
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      routines.createAppointment({
        index: 3,
        date: aDT.date,
        time: appTimes.time16,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            startTime: aDT.time,
            appointmentType: 'Full Hour',
          },
        ],
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            startTime: appTimes.time16,
            appointmentType: 'Full Hour',
          },
        ],
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          startTime: aDT.time,
          appointmentType: 'Full Hour',
        },
      });

      routines.deleteAppointment({
        index: 6,
        date: aDT.date,
        time: aDT.time,
      });

      routines.checkVerification({
        index: 7,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: aDT.date,
            startTime: appTimes.time16,
            appointmentType: 'Full Hour',
          },
        ],
        noInArrears: true,
      });

      routines.checkSessions({
        index: 8,
        client: this.clients.client1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          startTime: appTimes.time16,
          appointmentType: 'Full Hour',
        },
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
            startTime: appTimes.time16,
            appointmentType: 'Full Hour',
          },
        ],
      });
    });
  });
});
