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
      cy.createAppointment(aDT.appointmentDate, aDT.time, clientName, 'Full Hour');

      cy.log('-----PURCHASE_1_SESSIONS-----');
      cy.goToPurchaseSessionForm('Abelow');
      cy.dataId('fullHour-container', 'div').find('input').type(1);
      cy.get('form').submit();
      cy.wait(1000);

      cy.navTo('Trainer Verification');
      cy.get('div.ant-table-selection input').click();
      cy.wait(1000);
      cy.get('button.contentHeader__button').contains('Submit Verification').click();

      cy.log('-----CONFIRMATION_BOX-----');
      cy.get('div.ant-confirm-content').contains(`1 Appointments for $42.58`);
      cy.get('button').contains('OK').click();

      cy.log('-----GO_TO_PAY_TRAINER-----');
      cy.navTo('Trainers');
      const row = cy.get('.ant-table-row-level-0').find('td').contains('Amahl').closest('tr');
      row.find('td:last div.list__cell__link').click();
      cy.get('.ant-table-row').should('have.length', 1);

      cy.log('-----SELECT TRAINER-----');
      cy.get('div.ant-table-selection input').click();
      cy.get('button.contentHeader__button').contains('Submit Trainer Payment').click();

      cy.log('-----CONFIRMATION_BOX-----');
      cy.get('div.ant-confirm-content').contains(`$42.58 for 1 Appointments`);
      cy.get('button').contains('OK').click();
      cy.get('tr.row-in-arrears').should('have.length', 0);

      cy.log('-----VERIFY_PAYMENT-----');
      cy.navTo('Payment History');
      cy.wait(1000);
      cy.get('.ant-table-row').should('have.length', 1);
      cy
        .get('.ant-table-row')
        .find('td')
        .contains('$42.5')
        .should('exist')
        .closest('tr')
        .find('span')
        .contains(Cypress.moment().format('MM/DD/YYYY'))
        .click();
      cy.get('.ant-table-row').should('have.length', 1);
      cy.get('.ant-table-row td:first').contains('Hanna Abelow');

      cy.log('-----CHECK_APPOINTMENT_CANT_BE_CHANGED-----');
      cy.navTo('Calendar');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Delete').should('not.exist');
      cy.get(`.form__footer__button`).contains('Edit').should('not.exist');
    });
  });
});
