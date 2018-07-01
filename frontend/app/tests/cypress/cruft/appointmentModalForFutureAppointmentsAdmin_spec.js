/* eslint-disable no-undef */
describe.skip('Appointment Modal For Future Appointments Admin', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment);
  const newDay = Cypress.moment(aDT.day).add(1, 'day');
  const newDayString = newDay.format('ddd MM/DD');
  const newDateString = newDay.format('MM/DD/YYYY');

  beforeEach(() => {
    routines.loginAdmin({});
    cy.deleteAllAppointments();
    cy.visit('/');
  });

  describe('When submitting form', () => {
    it('Should create new appointment', function() {
      cy.clickEmptySlot(aDT.appointmentDate, aDT.time);
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Barr Sarah')
        .click();
      cy.get('form').submit();
      cy.get(
        `ol[data-id='${aDT.appointmentDate}'] li[data-id='${
          aDT.time
        }'] .redux__task__calendar__task__item`,
      ).should('exist');
    });
  });

  describe('When clicking on existing appointment', () => {
    it('Should load appointment in modal', function() {
      cy.createAppointment(
        aDT.appointmentDate,
        aDT.time,
        'Barr Sarah',
        'Full Hour',
      );
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get('ul[data-id=clients] li').contains('Barr Sarah');
      cy.get('span[data-id=appointmentType]').contains('Full Hour');
      cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
      cy.get('span[data-id=startTime]').contains(aDT.time);
      cy.get('span[data-id=notes]').contains('Hi! Everybody!');
    });
  });

  describe('When making changes in modal', () => {
    it('should update dependent fields', () => {
      cy.clickEmptySlot(aDT.appointmentDate, aDT.time);
      //select multiple clients
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Barr Sarah')
        .click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Ahern Jessica')
        .click();
      cy.get('#clients').blur();
      cy.dataId('appointmentType-container', 'div')
        .get('.ant-select-selection-selected-value')
        .contains('Pair');
      // change appointmentType from pair to halfhour
      cy.get('#appointmentType').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Half Hour')
        .click();
      cy.dataId('clients-container', 'div')
        .find('.ant-select-selection-selected-value')
        .should('not.exist');
      // change endTime when startTime changes
      cy.get('#startTime').click({ force: true });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('5:00 PM')
        .click();
      cy.dataId('endTime-container', 'div')
        .find('input')
        .should('have.value', '5:30 PM');

      // change endTime when appointmentType changes
      cy.get('#appointmentType').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Full Hour')
        .click();
      cy.get('#appointmentType').blur();
      cy.dataId('endTime-container', 'div')
        .find('input')
        .should('have.value', '6:00 PM');
    });
  });

  describe('When clicking on delete appointment', () => {
    it('Should delete appointment', function() {
      cy.createAppointment(
        aDT.appointmentDate,
        aDT.time,
        'Barr Sarah',
        'Full Hour',
      );
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`)
        .contains('Delete')
        .click();
      cy.get(
        `ol[data-id='${aDT.day}'] li[data-id='${
          aDT.time
        }'] .redux__task__calendar__task__item`,
      ).should('not.exist');
    });
  });

  describe('When copying appointment', () => {
    it('Should copy appointment', function() {
      cy.createAppointment(
        aDT.appointmentDate,
        aDT.time,
        'Barr Sarah',
        'Full Hour',
      );
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`)
        .contains('Copy')
        .click();
      cy.get('#startTime').click({ force: true });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('5:00 PM')
        .click();
      cy.get('form').submit();
      cy.get(
        `ol[data-id='${aDT.day}'] li[data-id='${
          aDT.time
        }'] .redux__task__calendar__task__item`,
      ).should('not.exist');
      cy.get(
        `ol[data-id='${
          aDT.day
        }'] li[data-id='5:00 PM'] .redux__task__calendar__task__item`,
      ).should('not.exist');
    });
  });

  describe('When editing an existing appointment', () => {
    it('Should persist all edits', function() {
      cy.createAppointment(
        aDT.appointmentDate,
        aDT.time,
        'Barr Sarah',
        'Full Hour',
      );
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`)
        .contains('Edit')
        .click();

      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Barr Sarah')
        .click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Ahern Jessica')
        .click();

      cy.get('#appointmentType').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
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

  describe('When editing an existing appointment changing day but still future', () => {
    it('Should persist', function() {
      cy.createAppointment(
        aDT.appointmentDate,
        aDT.time,
        'Barr Sarah',
        'Full Hour',
      );
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`)
        .contains('Edit')
        .click();

      cy.dataId('date-container', 'div')
        .get('.ant-calendar-picker')
        .click();
      cy.get('.ant-calendar-input').type(
        `{selectAll}{backspace}${newDateString}{enter}`,
      );
      cy.dataId('date-container', 'div')
        .get('.ant-calendar-input')
        .blur();

      cy.get('form').submit();

      cy.clickOnAppointment(newDayString, aDT.time);
      cy.get('ul[data-id=clients] li').contains('Barr Sarah');
      cy.get('span[data-id=appointmentType]').contains('Full Hour');
      cy.get('span[data-id=date]').contains(newDateString);
      cy.get('span[data-id=startTime]').contains(aDT.time);
      cy.get('span[data-id=notes]').contains('Hi! Everybody!');
    });
  });

  describe.skip('When dragging an appointment to empty slot but still future', () => {
    it('Should persist', function() {
      cy.on('uncaught:exception', ex => {
        Cypress.log({ message: ex });
      });
      cy.createAppointment(
        aDT.appointmentDate,
        aDT.time,
        'Barr Sarah',
        'Full Hour',
      );
      const appt = cy
        .get(
          `ol[data-id='${aDT.appointmentDate}'] li[data-id='${
            aDT.time
          }'] .redux__task__calendar__task__item`,
        )
        .then($el => {
          const x = cy.wrap($el);
          x.trigger('dragstart');
          Cypress.log({ $el, message: 'fu' });
          Cypress.log({ $el, message: x });
          Cypress.log({ $el, message: 'fu2' });
        });

      // if(appt) {
      //   appt.trigger('dragstart');
      //
      //   cy.get(`ol[data-id='${aDT.newDayString}'] li[data-id='${aDT.time}']`)
      //     .trigger('drop');
      // }
      // .trigger('mousedown', { which: 1 })
      // .trigger('mousemove', { clientX: 150, clientY: 10, force: true} )
      // .trigger('mouseup', {force: true});
      // cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
    });
  });
});
