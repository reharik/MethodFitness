const dtHelpers = require('../helpers/appointmentDateTimeHelpers');
const _routines = require('../helpers/routines');
const setupRoutes = require('../helpers/setupRoutes');
const _aDT = require('../fixtures/appointments');
const appTimes = require('../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Calling appointmentStatusUpdate', () => {
  let routines;

  beforeEach(() => {
    routines.cleanDB();
    setupRoutes(cy);
    routines = _routines(cy, Cypress, Cypress.moment);
    cy.log(dtHelpers);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('prices').as('prices');
    cy.fixture('clients').as('clients');
    cy.fixture('trainers').as('trainers');
  });

  describe('When calling appointmentStatusUpdate', () => {
    it('should pass all steps', function() {
      cy.log(this.clients.client1.id);
      aDT = _aDT(Cypress.moment, appTimes.time7, true);
      let time = dtHelpers.syncApptTypeAndTime('fullHour', aDT.time);
      let endTime = dtHelpers
        .buildMomentFromDateAndTime(aDT.date, time)
        .format();

      routines.scheduleAppointmentInPastButDontReconcile({
        date: aDT.date,
        startTime: dtHelpers
          .buildMomentFromDateAndTime(aDT.date, aDT.time)
          .format(),
        endTime,
        clientId: [this.clients.client1.id],
        trainerId: this.trainers.trainer1.id,
        appointmentType: 'fullHour',
      });
      cy.wait(1000);
      routines.clickOnAppointment({ index: 2, date: aDT.date, time: aDT.time });
      cy.get(`.form__footer__button`)
        .contains('Cancel')
        .click();

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        fullHourCount: 0,
      });
      const apiHost = Cypress.env('API_BASE_URL');
      cy.request('POST', `${apiHost}/scheduledjobs/appointmentstatusupdate`);
      cy.wait(1000);
      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: -1,
      });
    });
  });
  describe('When calling appointmentStatusUpdate', () => {
    it('should should not affect appointments in future', function() {
      cy.log(this.clients.client1.id);
      aDT = _aDT(Cypress.moment, appTimes.time7, true);
      let time = dtHelpers.syncApptTypeAndTime('fullHour', aDT.time);
      let endTime = dtHelpers
        .buildMomentFromDateAndTime(aDT.date, time)
        .format();

      routines.scheduleAppointmentInPastButDontReconcile({
        date: aDT.date,
        startTime: dtHelpers
          .buildMomentFromDateAndTime(aDT.date, aDT.time)
          .format(),
        endTime,
        clientId: [this.clients.client1.id],
        trainerId: this.trainers.trainer1.id,
        appointmentType: 'fullHour',
      });

      routines.scheduleAppointmentInPastButDontReconcile({
        date: aDT.date,
        startTime: dtHelpers
          .buildMomentFromDateAndTime(aDT.date, aDT.time)
          .format(),
        endTime,
        clientId: [this.clients.client1.id],
        trainerId: this.trainers.trainer1.id,
        appointmentType: 'fullHour',
      });
      cy.wait(1000);
      routines.clickOnAppointment({ index: 2, date: aDT.date, time: aDT.time });
      cy.get(`.form__footer__button`)
        .contains('Cancel')
        .click();

      routines.checkClientInventory({
        index: 1,
        client: this.clients.client1,
        fullHourCount: 0,
      });
      const apiHost = Cypress.env('API_BASE_URL');
      cy.request('POST', `${apiHost}/scheduledjobs/appointmentstatusupdate`);
      cy.wait(1000);
      routines.checkClientInventory({
        index: 2,
        client: this.clients.client1,
        fullHourCount: -1,
      });
    });
  });
});
