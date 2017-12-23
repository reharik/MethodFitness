/* eslint-disable no-undef */
describe('Pay Trainer', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment, '8:00 AM', true);

  beforeEach(() => {
    cy.loginAdmin();
    cy.deleteAllAppointments();
    cy.visit('/');
  });

  describe('pay trainer workflow', () => {
    it('Should complete', function() {
      const clientName = 'Abelow Hanna';
      // create appointment in past
      cy.createAppointment(aDT.appointmentDate, aDT.time, clientName, 'Full Hour');

      // purchase session
      cy.log('-----PURCHASE_1_SESSIONS-----');
      cy.goToPurchaseSessionForm('Abelow');
      cy.dataId('fullHour-container', 'div').find('input').type(1);
      cy.get('form').submit();
      cy.wait(1000);

      // delete appointment.  we now have one available session
      cy.deleteAppointment(aDT.day, aDT.time);
      cy.wait(1000);

      // create new appointment in past
      cy.createAppointment(aDT.appointmentDate, aDT.time, clientName, 'Full Hour');

    });
  });
});