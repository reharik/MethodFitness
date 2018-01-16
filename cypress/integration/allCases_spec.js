/* eslint-disable no-undef */
describe('ALL_CASES', () => {

  describe('Appointment Modal For Future Appointments Admin', () => {
    const aDT = require('./../fixtures/appointments')(Cypress.moment);
    const newDay = Cypress.moment(aDT.day).add(1, 'day');
    const newDayString = newDay.format('ddd MM/DD');
    const newDateString = newDay.format('MM/DD/YYYY');

    beforeEach(() => {
      cy.server();

      cy.loginAdmin();
      cy.deleteAllAppointments();
      cy.visit('/');
    });

    describe('when creating, editing and deleting an appointment in the future', () => {
      it('should perform as expected', () => {
        cy.route({
          method: 'GET',
          url: '/fetchAppointments/*'
        }).as('fetchAppointments');
        cy.route({
          method: 'POST',
          url: 'appointment/updateAppointment'
        }).as('updateAppointment');
        cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour', true);
        cy.clickOnAppointment(aDT.appointmentDate, aDT.time);

        cy.log('-----check values are correct-----');
        cy.get('ul[data-id=clients] li').contains('Barr Sarah');
        cy.get('span[data-id=appointmentType]').contains('Full Hour');
        cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
        cy.get('span[data-id=startTime]').contains(aDT.time);
        cy.get('span[data-id=notes]').contains('Hi! Everybody!');

        cy.log('-----edit some values-----');
        cy.get(`.form__footer__button`).contains('Edit').click();

        cy.log('-----add another client-----');
        cy.get('#clients').click();
        cy
          .get('.ant-select-dropdown-menu-item')
          .contains('Ahern Jessica')
          .click();
        cy.get('#clients').blur();

        cy.log('-----should change type to pair-----');
        cy
          .dataId('appointmentType-container', 'div')
          .get('.ant-select-selection-selected-value')
          .contains('Pair');
        // change appointmentType from pair to halfhour
        cy.get('#appointmentType').click({force: true});

        cy.log('-----should remove clients when switching from pair to halfhour-----');
        cy
          .get('.ant-select-dropdown-menu-item')
          .contains('Half Hour')
          .click();
        cy
          .dataId('clients-container', 'div')
          .find('.ant-select-selection-selected-value')
          .should('not.exist');

        cy.log('-----readd client-----');
        cy.get('#clients').click();
        cy
          .get('.ant-select-dropdown-menu-item')
          .contains('Ahern Jessica')
          .click();
        cy.get('#clients').blur();

        cy.log('-----should change end time when start time chnages-----');
        cy.get('#startTime').click({force: true});
        cy
          .get('.ant-select-dropdown-menu-item')
          .contains('5:00 PM')
          .click();
        cy
          .dataId('endTime-container', 'div')
          .find('input')
          .should('have.value', '5:30 PM');

        cy.log('-----should change end time when type changes-----');
        cy.get('#appointmentType').click({force: true});
        cy
          .get('.ant-select-dropdown-menu-item')
          .contains('Full Hour')
          .click();
        cy.get('#appointmentType').blur();
        cy
          .dataId('endTime-container', 'div')
          .find('input')
          .should('have.value', '6:00 PM');
        cy.get('#notes').type('By! Everybody!');

        cy.log('-----save appointment-----');
        cy.get('form').submit();
        cy.wait('@updateAppointment');
        cy.clickOnAppointment(aDT.appointmentDate, '5:00 PM');

        cy.log('-----check values are correct-----');
        cy.get('ul[data-id=clients] li').contains('Ahern Jessica');
        cy.get('span[data-id=appointmentType]').contains('Full Hour');
        cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
        cy.get('span[data-id=startTime]').contains('5:00 PM');
        cy.get('span[data-id=endTime]').contains('6:00 PM');
        cy.get('span[data-id=notes]').contains('By! Everybody!');

        cy.log('-----delete appointment-----');
        cy.get(`.form__footer__button`).contains('Delete').click();
        cy
          .get(`ol[data-id='${aDT.day}'] li[data-id='${aDT.time}'] .redux__task__calendar__task__item`)
          .should('not.exist');
      });
    });

    describe('When copying appointment', () => {
      it('Should copy appointment', function() {

        cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour', true);
        cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
        cy.get(`.form__footer__button`).contains('Copy').click();
        cy.get('#startTime').click({force: true});
        cy
          .get('.ant-select-dropdown-menu-item')
          .contains('5:00 PM')
          .click();
        cy.get('form').submit();
        cy
          .get(`ol[data-id='${aDT.day}'] li[data-id='${aDT.time}'] .redux__task__calendar__task__item`)
          .should('not.exist');
        cy
          .get(`ol[data-id='${aDT.day}'] li[data-id='5:00 PM'] .redux__task__calendar__task__item`)
          .should('not.exist');
      });
    });

    // this is a different bode branch than changing the other fields hence the new test
    describe('When editing an existing appointment changing day but still future', () => {
      it('Should persist', function() {
        cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour', true);
        cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
        cy.get(`.form__footer__button`).contains('Edit').click();

        cy.dataId('date-container', 'div').get('.ant-calendar-picker').click();
        cy
          .get('.ant-calendar-input')
          .type(`{selectAll}{backspace}${newDateString}{enter}`);
        cy.dataId('date-container', 'div').get('.ant-calendar-input').blur();

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
        cy.on('uncaught:exception', (ex) => {
          Cypress.log({message: ex})
        })
        cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour');
        const appt = cy
          .get(`ol[data-id='${aDT.appointmentDate}'] li[data-id='${aDT.time}'] .redux__task__calendar__task__item`)
          .then($el => {
            const x = cy.wrap($el);
            x.trigger('dragstart')
            Cypress.log({$el, message: 'fu'});
            Cypress.log({$el, message: x});
            Cypress.log({$el, message: 'fu2'});
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
});