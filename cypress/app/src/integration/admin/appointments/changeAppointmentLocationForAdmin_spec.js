const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');
let aDT;

describe('Change Appointment location in the Past For Admin', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('clients').as('clients');
  });

  describe('When creating an appointment changing the location', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time13, true);
      routines.createAppointment({
        date: aDT.date,
        time: aDT.time,
        client: this.clients.client1,
        appointmentType: 'Full Hour',
      });

      const appointmentValues = {
        index: 2,
        date: aDT.date,
        time: aDT.time,
        location: 'somewhere else',
      };
      routines.changeAppointment(appointmentValues);
      routines.clickOnAppointment(appointmentValues);
      cy.get(
        `div[data-id='locationId-container'] .display__container__value > span`,
      ).contains('somewhere else');
    });
  });
});
