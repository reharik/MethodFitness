const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating an Appointment in the Past Changing Appointment Type', () => {
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

  describe('When changing apointmentType before funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '0',
        halfHourCount: '-1',
      });

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.purchaseSessions({
        index: 5,
        client: this.clients.client1,
        halfHourCount: '2',
      });

      routines.checkClientInventory({
        index: 6,
        client: this.clients.client1,
        halfHourCount: '1',
      });

      routines.checkSessions({
        index: 7,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.checkVerification({
        index: 8,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });

  describe('When changing apointmentType after funded for first AT to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time11, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2',
        halfHourCount: '-1',
      });

      routines.checkSessions({
        index: 4,
        client: this.clients.client1,
        availableCount: 2,
      });

      routines.checkVerification({
        index: 5,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });

  describe('When changing apointmentType after funded for first AT to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time11, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
        halfHourCount: '2',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: '2',
        halfHourCount: '1',
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });

  describe('When changing apointmentType after verification', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time12, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: '1',
        halfHourCount: '0',
      });

      routines.verifyAppointments({
        index: 3,
      });

      appointmentValues = {
        index: 4,
        date: aDT.date,
        time: aDT.time,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      //projections seem to take a long time on this one
      cy.wait(2000);
      routines.checkVerification({
        index: 5,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.checkPayTrainer({
        index: 6,
        trainer: this.trainers.trainer1,
        payableCount: 0,
      });

      routines.purchaseSessions({
        index: 7,
        client: this.clients.client1,
        halfHourCount: '2',
      });

      routines.checkClientInventory({
        index: 8,
        client: this.clients.client1,
        fullHourCount: '2',
        halfHourCount: '1',
      });

      routines.checkSessions({
        index: 9,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.checkVerification({
        index: 10,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 11,
      });

      routines.payTrainer({
        index: 12,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 13,
        appointmentCount: 1,
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });
});
