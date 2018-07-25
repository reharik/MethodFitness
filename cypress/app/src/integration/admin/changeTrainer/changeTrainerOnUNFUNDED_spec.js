const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Change Trainer on Unfunded Appointment', () => {
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

  describe('When changing trainer on unpaid appointment', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: aDT.date,
          appointmentType: 'Full Hour',
        },
      });
    });
  });

  describe('When changing trainer and type on unfunded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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
    });
  });

  describe('When changing trainer and type on unfunded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client1,
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
        availableCount: 1,
        availableItemValues: {
          client: this.clients.client1,
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

  describe('When changing trainer and client on unfunded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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
    });
  });

  describe('When changing trainer and client on unfunded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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

  describe('When changing trainer and client and type on unfunded -> unfunded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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
    });
  });

  describe('When changing trainer and client and type on unfunded -> funded', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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
        avaialbelCount: 1,
        avaialbelItemValues: {
          client: this.clients.client2,
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

  /*
  so don't need to logout
  this is what happens in unpaidAppointments

   {                                                                   +|
     "trainerId": "91576303-326d-4d04-9f55-02e02d38b8f7",            +|
     "unpaidAppointments": [                                         +|
         {                                                           +|
             "clientId": "9c686f86-7202-4d34-8fb9-30165bee1ade",     +|
             "trainerId": "91576303-326d-4d04-9f55-02e02d38b8f7",    +|
             "clientName": "Barr, Sarah",                            +|
             "appointmentId": "a6c8cd68-784e-4d39-a2eb-df988599a27d",+|
             "appointmentDate": "2018-07-23T05:00:00.000Z",          +|
             "appointmentType": "fullHour",                          +|
             "startTime": "2018-07-23T20:00:00-05:00"     +|
         }                                                           +|
     ]                                                               +|
 }                                                                    |
 {                                                                   +|
     "trainerId": "a2312f85-a218-4bc0-ac5e-1108be7af0de",            +|
     "unpaidAppointments": [                                         +|
         {                                                           +|
             "notes": "Hi! Everybody!",                              +|
             "endTime": "2018-07-22T21:00:00-05:00",                 +|
             "clientId": "9c686f86-7202-4d34-8fb9-30165bee1ade",     +|
             "startTime": "2018-07-22T20:00:00-05:00",               +|
             "trainerId": "a2312f85-a218-4bc0-ac5e-1108be7af0de",    +|
             "clientName": "Barr, Sarah",                            +|
             "appointmentId": "a6c8cd68-784e-4d39-a2eb-df988599a27d",+|
             "appointmentDate": "2018-07-23T05:00:00.000Z",          +|
             "appointmentType": "fullHour",                          +|
             "startTime": "2018-07-23T20:00:00-05:00"     +|
         }                                                           +|
     ]                                                               +|
 }

  I don't really know wtf is going on, why is there startTime as well as startTime
  obviously the startTime has the correct date and teh appointmentDate is incorrect
  and why is the trainer#915 appointment still there.

   */

  describe('When changing trainer and date on unpaid appointment', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time1, true);
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

      const newDate = Cypress.moment(aDT.date).subtract(1, 'day');
      cy.log(`==========newDate.toString()==========`);
      cy.log(newDate.toString());
      cy.log(aDT.date.toString());
      cy.log(`==========END newDate.toString()==========`);

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
        inarrearsCount: 1,
        inarrearsItemValues: {
          client: this.clients.client1,
          date: newDate,
          appointmentType: 'Full Hour',
        },
      });
    });
  });
});
