const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Moving Pairs From Future to Past', () => {
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

  describe('When moving unfunded from future to past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
        future: true,
      });

      const newDate = Cypress.moment(aDT.day).subtract(2, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client2,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 3,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: newDate,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When moving partly funded from future to past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
        future: true,
      });

      const newDate = Cypress.moment(aDT.day).subtract(2, 'day');
      appointmentValues = {
        index: 4,
        date: aDT.date,
        time: aDT.time,
        newDate,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 5,
        client: this.clients.client1,
        pairCount: 1,
      });

      routines.checkClientInventory({
        index: 5,
        client: this.clients.client2,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Pair',
          },
        ],
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client2,
            date: newDate,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
      });

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
            date: newDate,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When moving funded from future to past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1, this.clients.client2],
        appointmentType: 'Pair',
        future: true,
      });

      const newDate = Cypress.moment(aDT.day).subtract(2, 'day');
      appointmentValues = {
        index: 4,
        date: aDT.date,
        time: aDT.time,
        newDate,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 5,
        client: this.clients.client1,
        pairCount: 1,
      });

      routines.checkClientInventory({
        index: 5,
        client: this.clients.client2,
        pairCount: 1,
      });

      routines.checkVerification({
        index: 6,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: newDate,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client2,
        availableCount: 1,
      });

      routines.verifyAppointments({
        index: 7,
      });

      routines.checkPayTrainer({
        index: 8,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 9,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 10,
        appointmentCount: 2,
        appointments: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Pair',
          },
          {
            client: this.clients.client2,
            date: newDate,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });
});
