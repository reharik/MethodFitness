const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating an Appointment in the Past Changing Date', () => {
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

  describe.only('When changing date on unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time9, true);

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate: newDate,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: '-1',
      });

      routines.checkVerification({
        index: 3,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Full Hour',
        },
      });
    });
  });

  describe('When changing date on funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time9, true);

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

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '1',
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: newDate,
          appointmentType: 'Full Hour',
        },
      });

      routines.verifyAppointments({
        index: 6,
      });

      routines.checkPayTrainer({
        index: 7,
        trainer: this.trainers.trainer1,
        payableCount: 1,
      });

      routines.payTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 9,
        appointmentCount: 1,
        appointmentValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Full Hour',
        },
      });
    });
  });
});
