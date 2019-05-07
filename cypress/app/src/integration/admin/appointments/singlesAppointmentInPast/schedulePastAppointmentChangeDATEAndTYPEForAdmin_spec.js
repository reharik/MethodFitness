const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating an Appointment in the Past Changing Date and Type', () => {
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

  describe('When changing date and type on unfunded to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time5, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: 0,
        halfHourCount: -1,
      });

      routines.checkVerification({
        index: 3,
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Half Hour',
          },
        ],
      });
    });
  });

  describe('When changing date and type on unfunded to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time5, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        halfHourCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: 0,
        halfHourCount: 1,
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Half Hour',
          },
        ],
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: newDate,
          appointmentType: 'Half Hour',
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
        appointments: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Half Hour',
          },
        ],
      });
    });
  });

  describe('When changing date and type on funded to unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time6, true);

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

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 1,
        date: aDT.date,
        time: aDT.time,
        newDate,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: 2,
        halfHourCount: -1,
      });

      routines.checkVerification({
        index: 3,
        inArrearsCount: 1,
        inArrearsItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Half Hour',
          },
        ],
      });
    });
  });

  describe('When changing date and type on funded to funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time6, true);

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: 2,
        halfHourCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.clients.client1],
        appointmentType: 'Full Hour',
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newDate,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.clients.client1,
        fullHourCount: 2,
        halfHourCount: 1,
      });

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Half Hour',
          },
        ],
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 3,
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
        client: this.clients.client1,
        appointmentCount: 1,
        appointments: [
          {
            client: this.clients.client1,
            date: newDate,
            appointmentType: 'Half Hour',
          },
        ],
      });
    });
  });
});
