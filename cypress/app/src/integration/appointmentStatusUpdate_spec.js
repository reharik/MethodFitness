const dtHelpers = require('../helpers/appointmentDateTimeHelpers');
const _routines = require('../helpers/routines');
const setupRoutes = require('../helpers/setupRoutes');
const _aDT = require('../fixtures/appointments');
const appTimes = require('../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe.skip('Calling appointmentStatusUpdate', () => {
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
    cy.fixture('locations').as('locations');
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
        locationId: this.locations.location1.id,
      });
      cy.wait(1000);
      cy.navTo('Calendar');
      cy.wait('@fetchAppointments', {
        log: false,
      });

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
      let startTime = dtHelpers.buildMomentFromDateAndTime(aDT.date, aDT.time);

      routines.scheduleAppointmentInPastButDontReconcile({
        date: aDT.date,
        startTime: startTime.format(),
        endTime: Cypress.moment(startTime)
          .add(1, 'hour')
          .format(),
        clientId: [this.clients.client1.id],
        trainerId: this.trainers.trainer1.id,
        appointmentType: 'fullHour',
        locationId: this.locations.location1.id,
      });

      const aDTFuture = _aDT(Cypress.moment, appTimes.time15);
      routines.createAppointment({
        date: aDTFuture.date,
        time: aDTFuture.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
        future: true,
      });

      cy.wait(1000);
      cy.navTo('Calendar');
      cy.wait('@fetchAppointments', {
        log: false,
      });

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
