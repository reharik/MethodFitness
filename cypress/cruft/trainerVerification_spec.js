/* eslint-disable no-undef */
describe.skip('Trainer Verification', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment, undefined, true);

  beforeEach(() => {
    cy.loginAdmin();
    cy.deleteAllAppointments();
    cy.visit('/');
  });

  describe('trainer verification workflow', () => {
    it('Should complete', function() {
      cy.createAppointment(aDT.appointmentDate, aDT.time, 'Ahern Jessica', 'Full Hour');
      cy.createAppointment(aDT.appointmentDate, aDT.setTime(2), 'Ahern Jessica', 'Full Hour');

      cy.log('-----CHECK_FOR_UNPAID_APPOINTMENT-----');
      cy.navTo('Trainer Verification');
      cy.get('.ant-table-row').should('have.class', 'row-in-arrears');
      cy.get('tr.row-in-arrears').should('have.length', 2);

      cy.goToPurchaseSessionForm('Ahern');

      cy.log('-----PURCHASE_1_SESSION-----');
      cy.dataId('fullHour-container', 'div').find('input').type(1);
      cy.get('form').submit();
      cy.dataId('returnToClient', 'a').should('exist');

      cy.log('-----CHECK_FOR_ONE_UNPAID_AND ONE_PAID_APPOINTMENT-----');
      cy.navTo('Trainer Verification');
      cy.wait(1000);
      cy.get('.ant-table-row').should('have.length', 2);
      cy.get('tr.row-in-arrears').should('have.length', 1);

      cy.log('-----DELETE_APPOINTMENT_REFUNDING_ONE_SESSION_AND_FUNDING_UNFUNDED_APPOINTMENT-----');
      cy.deleteAppointment(aDT.day, aDT.time);
      cy.wait(1000);

      cy.log('-----CHECK_FOR_ONE_PAID_APPOINTMENT-----');
      cy.navTo('Trainer Verification');
      cy.wait(1000);
      cy.get('.ant-table-row').should('have.length', 1);
      cy.get('tr.row-in-arrears').should('have.length', 0);

      cy.log('-----CREATE_NEW_UNPAID_APPOINTMENT-----');
      cy.navTo('Calendar');
      cy.createAppointment(aDT.appointmentDate, aDT.time, 'Ahern Jessica', 'Full Hour');

      cy.log('-----VERIFY_AVAILABLE_APPOINTMENTS-----');
      cy.navTo('Trainer Verification');
      cy.get('div.ant-table-selection input').click();
      cy.get('button.contentHeader__button').contains('Submit Verification').click();

      cy.log('-----CONFIRMATION_BOX-----');
      cy.get('div.ant-confirm-content').contains(`1 Appointments for $42.58`);
      cy.get('button').contains('OK').click();
      cy.get('tr.row-in-arrears').should('have.length', 1);

      cy.log('-----GO_TO_PAY_TRAINER-----');
      cy.navTo('Trainers');
      const row = cy.get('.ant-table-row-level-0').find('td').contains('Amahl').closest('tr');
      row.find('td:last div.list__cell__link').click();
      cy.get('.ant-table-row').should('have.length', 1);
    });
  });


});
