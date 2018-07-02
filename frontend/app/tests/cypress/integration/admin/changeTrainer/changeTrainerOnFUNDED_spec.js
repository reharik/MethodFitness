const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Change Trainer on funded Appointment', () => {
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

  describe('When changing trainer on paid appointment', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        availabaleCount: 1,
        availabaleItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
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
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });
    });
  });

  describe('When changing trainer and type on funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });
    });
  });

  describe('When changing trainer and type on funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
        halfHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        availabaleCount: 1,
        availabaleItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 3,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
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
        appointmentValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });

  describe('When changing trainer and client from funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });
    });
  });

  describe('When changing trainer and client from funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
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
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });
    });
  });

  describe('When changing trainer and client and type on funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });
    });
  });

  describe('When changing trainer and client and type on funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      routines.purchaseSessions({
        index: 1,
        client: this.clients.client2,
        halfHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        currentClient: this.clients.client1,
        newClient: this.clients.client2,
        appointmentType: 'Half Hour',
      };
      routines.changeAppointment(appointmentValues);

      routines.checkVerification({
        index: 4,
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour',
          usedCount: 1,
          usedItemValues: {
            date: aDT.date,
            appointmentType: 'half Hour',
          },
        },
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client1,
        availableCount: 2,
      });

      routines.checkSessions({
        index: 5,
        client: this.clients.client2,
        availableCount: 1,
        usedCount: 1,
        usedItemValues: {
          date: aDT.date,
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
        appointmentValues: {
          client: this.clients.client2,
          date: aDT.date,
          appointmentType: 'Half Hour',
        },
      });
    });
  });

  describe('When changing trainer and date on paid appointment', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
        fullHourCount: '2',
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        index: 1,
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        trainer: this.trainers.trainer2,
        appointmentType: 'Full Hour',
      });

      routines.checkVerification({
        index: 2,
        noInarrears: true,
        noAvailable: true,
      });

      const newDate = Cypress.moment(aDT.day).subtract(1, 'day');
      appointmentValues = {
        index: 3,
        date: aDT.date,
        time: aDT.time,
        newTrainer: this.trainers.trainer1,
        newDate,
      };
      routines.changeAppointment(appointmentValues);

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
