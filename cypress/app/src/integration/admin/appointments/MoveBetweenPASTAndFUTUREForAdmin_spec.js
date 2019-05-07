const _routines = require('../../../helpers/routines');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Moving between past and future', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress);
    routines.cleanDB();

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('clients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When moving unfunded from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });
      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        fullHourCount: 0,
      });

      routines.checkVerification({
        index: 3,
        noInarears: true,
      });
    });
  });

  describe('When moving funded from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);

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

      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        fullHourCount: 2,
      });

      routines.checkVerification({
        index: 4,
        noAvailable: true,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });
    });
  });

  describe('When moving funded, verified from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);

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

      routines.verifyAppointments({
        index: 11,
      });

      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        fullHourCount: 2,
      });

      routines.checkVerification({
        index: 4,
        noAvailable: true,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });
    });
  });

  describe('When moving unfunded from future to past', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
        future: true,
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: 0,
      });

      routines.checkVerification({
        index: 3,
        noInarears: true,
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
        fullHourCount: -1,
      });

      routines.checkVerification({
        index: 3,
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Full Hour',
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
        fullHourCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
        future: true,
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: 2,
      });

      routines.checkVerification({
        index: 3,
        noAvailable: true,
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
        fullHourCount: 1,
      });

      routines.checkVerification({
        index: 6,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
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
            date: newDate,
            appointmentType: 'Full Hour',
          },
        ],
      });
    });
  });
});
