const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Creating a Pairs Appointment in the Past Changing Both Clients', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('availableClients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When changing both clients unfunded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.availableClients.client1, this.availableClients.client2],
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newClient: this.availableClients.client3,
        newClient2: this.availableClients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client1,
        pairCount: 0,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client2,
        pairCount: 0,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client3,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client3,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client4,
        pairCount: 2,
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointments: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When changing both clients unfunded -> unfunded AND location', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.availableClients.client1, this.availableClients.client2],
        appointmentType: 'Pair',
        location: { name: 'default' },
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newClient: this.availableClients.client3,
        newClient2: this.availableClients.client4,
        location: { name: 'somewhere else' },
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client1,
        pairCount: 0,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client2,
        pairCount: 0,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client3,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client3,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client4,
        pairCount: 2,
      });

      routines.checkVerification({
        index: 8,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointments: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When changing both clients after funded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client2,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.availableClients.client1, this.availableClients.client2],
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newClient: this.availableClients.client3,
        newClient2: this.availableClients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client1,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client3,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.availableClients.client1,
        availableCount: 2,
      });

      routines.checkSessions({
        index: 7,
        client: this.availableClients.client2,
        availableCount: 2,
      });
    });
  });

  describe('When changing both clients after funded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client2,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client3,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client4,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.availableClients.client1, this.availableClients.client2],
        appointmentType: 'Pair',
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newClient: this.availableClients.client3,
        newClient2: this.availableClients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client1,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client3,
        pairCount: 1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client4,
        pairCount: 1,
      });

      routines.checkVerification({
        index: 4,
        availableCount: 2,
        availableItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.availableClients.client3,
        availableCount: 1,
      });

      routines.checkSessions({
        index: 7,
        client: this.availableClients.client4,
        availableCount: 1,
      });

      routines.verifyAppointments({
        index: 9,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 2,
      });

      routines.payTrainer({
        index: 11,
        trainer: this.trainers.trainer1,
      });

      routines.checkTrainerPayment({
        index: 12,
        appointmentCount: 2,
        appointments: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });
    });
  });

  describe('When changing both clients after verified -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time10, true);
      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client1,
        pairCount: 2,
      });

      routines.purchaseSessions({
        index: 5,
        client: this.availableClients.client2,
        pairCount: 2,
      });

      cy.navTo('Calendar');
      cy.wait('@fetchAppointments');

      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        clients: [this.availableClients.client1, this.availableClients.client2],
        appointmentType: 'Pair',
      });

      routines.verifyAppointments({
        index: 9,
      });

      appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        newClient: this.availableClients.client3,
        newClient2: this.availableClients.client4,
      };
      routines.changeAppointment(appointmentValues);

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client1,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client2,
        pairCount: 2,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client3,
        pairCount: -1,
      });

      routines.checkClientInventory({
        index: 3,
        client: this.availableClients.client4,
        pairCount: -1,
      });

      routines.checkVerification({
        index: 4,
        inArrearsCount: 2,
        inArrearsItemValues: [
          {
            client: this.availableClients.client3,
            date: aDT.date,
            appointmentType: 'Pair',
          },
          {
            client: this.availableClients.client4,
            date: aDT.date,
            appointmentType: 'Pair',
          },
        ],
      });

      routines.checkSessions({
        index: 7,
        client: this.availableClients.client1,
        availableCount: 2,
      });

      routines.checkSessions({
        index: 7,
        client: this.availableClients.client2,
        availableCount: 2,
      });

      routines.checkPayTrainer({
        index: 10,
        trainer: this.trainers.trainer1,
        payableCount: 0,
      });
    });
  });
});
