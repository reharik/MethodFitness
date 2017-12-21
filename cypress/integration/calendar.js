describe('Calendar', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment);

  beforeEach(() => {
    cy.loginAdmin();
    cy.deleteAllAppointments();
    cy.visit('/');
  });

  describe('When clicking on empty timeslot', () => {
    it('Should should display modal', function() {
      const timeSlot = cy.get(`ol[data-id='${aDT.appointmentDate}'] li[data-id='${aDT.time}']`);
      timeSlot.click();
      cy.get('.mf__modal__wrapper').should('be.visible');
    });
  });

  describe('Appointments', () => {

  });
});
