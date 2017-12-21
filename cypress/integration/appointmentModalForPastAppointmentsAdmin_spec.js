/* eslint-disable no-undef */
describe('Appointment Modal For Past Appointments Admin', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment, undefined, true);

  beforeEach(() => {
    cy.loginAdmin();
    cy.deleteAllAppointments();
    cy.visit('/');
  });

  describe('When clicking on time slot in the past', () => {
    it('Should allow you to create new appointment', function() {
      cy.clickEmptySlot(aDT.appointmentDate, aDT.time);
      cy.get('#clients').click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Barr Sarah')
        .click();
      cy.get('form').submit();
      cy
        .get(`ol[data-id='${aDT.appointmentDate}'] li[data-id='${aDT.time}'] .redux__task__calendar__task__item`)
        .should('exist');
    });
  });

  describe('When clicking on delete appointment', () => {
    it('Should delete appointment', function() {
      cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Delete').click();
      cy.wait(1000)
      cy
        .get(`ol[data-id='${aDT.day}'] li[data-id='${aDT.time}'] .redux__task__calendar__task__item`)
        .should('not.exist');
    });
  });

  describe('When editing an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();

      cy.get('#clients').click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Barr Sarah')
        .click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Ahern Jessica')
        .click();

      cy.get('#appointmentType').click({force: true});
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Full Hour')
        .click();

      cy.get('#notes').type('By! Everybody!');

      cy.get('form').submit();

      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get('ul[data-id=clients] li').contains('Ahern Jessica');
      cy.get('span[data-id=appointmentType]').contains('Full Hour');
      cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
      cy.get('span[data-id=startTime]').contains(aDT.time);
      cy.get('span[data-id=notes]').contains('By! Everybody!');
    });
  });

});
