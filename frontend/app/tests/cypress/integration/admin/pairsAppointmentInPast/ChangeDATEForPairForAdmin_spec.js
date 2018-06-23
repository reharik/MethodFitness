const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating a Pairs Appointment in the Past Changing DATE', () => {
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

  describe('When changing date on unfunded Pair', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair'
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: '-1'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '-1'
      });

      routines.checkVerification({
        index: 4,
        inarrearsCount: 2,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        },
        inarrearsItemValues2: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Pair'
        }
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: '2'
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client2,
        pairCount: '2'
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        },
        availableItemValues2: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Pair'
        }
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 9
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointmentValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        },
        appointmentValues2: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Pair'
        }
      });
    });
  });

  describe('When changing date on funded pair', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: '2'
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client2,
        pairCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair'
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: '1'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '1'
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        },
        availableItemValues2: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Pair'
        }
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 1
      });

      routines.verifyAppointments({
        index: 9
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointmentValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        },
        appointmentValues2: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Pair'
        }
      });
    });
  });

  describe('When changing Date on partly funded pair', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        pairCount: '2'
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pair'
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        pairCount: '1'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '-1'
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        },
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: newDate,
          appointmentType: 'Pair'
        }
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1
      });

      routines.verifyAppointments({
        index: 9
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 1
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 1,
        appointmentValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Pair'
        }
      });
    });
  });

});