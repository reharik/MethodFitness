const _routines = require('../../helpers/routines');
const setupRoutes = require('../../helpers/setupRoutes');
const _aDT = require('../../fixtures/appointments');
const appTimes = require('../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Moving Pairs From past to Future', () => {
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

  describe('When moving unfunded pair from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        client2: this.clients.client2,
        appointmentType: 'Pairs'
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
        pairCount: '0'
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client2,
        pairCount: '0'
      });

      routines.checkVerification({
        index: 3,
        noInarears: true
      });
    });
  });

  describe('When moving partly funded from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);

      routines.purchaseSessions({
        index: 1,
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
        appointmentType: 'Pairs'
      });

      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        pairCount: '2'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '0'
      });

      routines.checkVerification({
        index: 4,
        noInarears: true,
        noAvailable: true
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2
      });
    });
  });

  describe('When moving funded from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        pairCount: '2'
      });

      routines.purchaseSessions({
        index: 1,
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
        appointmentType: 'Pairs'
      });

      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        pairCount: '2'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '2'
      });

      routines.checkVerification({
        index: 8,
        noInarears: true,
        noAvailable: true
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 2
      });

    });
  });

  describe('When moving partly funded verified from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);

      routines.purchaseSessions({
        index: 1,
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
        appointmentType: 'Pairs'
      });

      routines.verifyAppointments({
        index: 6
      });

      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        pairCount: '2'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '0'
      });

      routines.checkVerification({
        index: 8,
        noInarears: true,
        noAvailable: true
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2
      });

    });
  });

  describe('When moving funded verified from past to future', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        pairCount: '2'
      });

      routines.purchaseSessions({
        index: 1,
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
        appointmentType: 'Pairs'
      });

      routines.verifyAppointments({
        index: 6
      });

      const newDate = Cypress.moment(aDT.day).add(2, 'day');
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
        pairCount: '2'
      });

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client2,
        pairCount: '2'
      });

      routines.checkVerification({
        index: 8,
        noInarears: true,
        noAvailable: true
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 2
      });

    });
  });
});