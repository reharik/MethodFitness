/* eslint-disable no-undef */
describe('Appointment Modal For Past Appointments Admin', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment, undefined, true);
  const client1 = 'Barr Sarah';
  const client1Last = 'Barr';
  const client2 = 'Ahern Jessica';
  const client2Last = 'Ahern';
  const client3 = 'Avedissian Amanda';
  const client3Last = 'Avedissian';

  beforeEach(() => {
    cy.server();
    cy.loginAdmin();
    cy.deleteAllAppointments();
    cy.visit('/');
    cy.fixture('prices').as('prices');
  });

  describe('When editing an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      cy.route({
        method: 'GET',
        url: '/fetchAllClients'
      }).as('fetchAllClients');
      cy.route({
        method: 'GET',
        url: '/trainerVerification/fetchUnverifiedAppointments'
      }).as('fetchUnverifiedAppointments');
      cy.route({
        method: 'POST',
        url: '/appointment/updateAppointmentFromPast'
      }).as('updateAppointmentFromPast');
      cy.route({
        method: 'GET',
        url: '/purchaselist/fetchpurchases/*'
      }).as('fetchpurchases');


      cy.createAppointment(aDT.appointmentDate, aDT.time, client1, 'Full Hour');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();

      cy.log('=======change some values=======');
      cy.dataId('clients-container', 'div')
        .find('li.ant-select-selection__choice')
        .contains(client1)
        .closest('li')
        .find('span.ant-select-selection__choice__remove')
        .click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains(client2)
        .click();

      cy.get('#appointmentType').click({force: true});
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Full Hour')
        .click();

      cy.get('#notes').type('By! Everybody!');

      cy.get('form').submit();
      cy.wait('@updateAppointmentFromPast');

      cy.log('=======verify changes persisted=======');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get('ul[data-id=clients] li').contains(client2);
      cy.get('span[data-id=appointmentType]').contains('Full Hour');
      cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
      cy.get('span[data-id=startTime]').contains(aDT.time);
      cy.get('span[data-id=notes]').contains('By! Everybody!');
      cy.get(`.form__footer__button`).contains('Cancel').click();

      cy.log('=======check that inventory has gone down one=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client2Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('-1');

      cy.log('=======check that verification is not possible=======');
      cy.navTo('Trainer Verification');
      cy.wait('@fetchUnverifiedAppointments');
      cy.get('.ant-table-row').should('have.class', 'row-in-arrears');
      cy.get('tr.row-in-arrears').should('have.length', 1);

      cy.log('=======purchase two sessions for ahern=======');
      cy.goToPurchasesList(client2Last);
      cy.get('.contentHeader__button__new').click();
      cy.dataId('fullHour-container', 'div').find('input').type(2);
      cy.get('form').submit();

      cy.log('=======check that inventory shows only 1=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client2Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('1');

      cy.log('=======check that one session is used and one available=======');
      // no idea why this is not necessary
      // cy.goToPurchasesList(client2Last');
      cy.wait('@fetchpurchases');
      cy
        .get('tr.ant-table-row-level-0:last')
        .find('td')
        .contains(this.prices.fullHour * 2)
        .should('exist')
        .closest('tr')
        .find('.ant-table-row-expand-icon')
        .click();
      cy.get('tr.ant-table-expanded-row-level-1')
        .find('tr.ant-table-row-level-0')
        .should('have.length', 2);
      cy.get('tr.row-gray').should('have.length', 1);

      cy.log('=======check that verification IS now possible=======');
      cy.navTo('Trainer Verification');
      cy.get('.ant-table-row').should('not.have.class', 'row-in-arrears');

      cy.log('=======change appointment type=======');
      cy.get('span.menu__item__leaf__link').contains('Calendar').click();
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();
      cy.get('#appointmentType').click({force: true});
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Half Hour')
        .click();
      cy.get('#appointmentType').blur();
      cy.get('form').submit();
      // cy.wait(1000);

      cy.log('=======check that inventory shows 2=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client2Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('2');
      cy.dataId('clientInventory', 'div').find(`span[data-id='halfHour']`).contains('-1');

      cy.log('=======check that both sessions are unused=======');
      cy.goToPurchasesList(client2Last);
      cy
        .get('tr.ant-table-row-level-0:last')
        .find('td')
        .contains(this.prices.fullHour * 2)
        .should('exist')
        .closest('tr')
        .find('.ant-table-row-expand-icon')
        .click();
      cy.get('tr.ant-table-expanded-row-level-1')
        .find('tr.ant-table-row-level-0')
        .should('have.length', 2);
      cy.get('tr.row-gray').should('not.exist');

      cy.log('=======check that verification is not possible=======');
      cy.navTo('Trainer Verification');
      cy.get('.ant-table-row').should('have.class', 'row-in-arrears');

      cy.log('=======change appointment client=======');
      cy.get('span.menu__item__leaf__link').contains('Calendar').click();
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();
      cy.dataId('clients-container', 'div')
        .find('li.ant-select-selection__choice')
        .contains(client2)
        .closest('li')
        .find('span.ant-select-selection__choice__remove')
        .click();
      cy.get('#clients').click({force: true});
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains(client3)
        .click();
      cy.get('#clients').blur();
      cy.get('form').submit();

      cy.log('=======check that ahern inventory shows 0 for half hour=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client2Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='halfHour']`).contains('0');

      cy.log('======refund ahers fullhours in hopes of clean up======');
      cy.goToPurchasesList(client2Last);
      cy
        .get('tr.ant-table-row-level-0:last')
        .find('td')
        .contains(this.prices.fullHour * 2)
        .should('exist')
        .closest('tr')
        .find('.ant-table-row-expand-icon')
        .click();
      cy.get('.ant-table-thead input').click();
      cy.get('button').contains('Submit Refund').click();

      cy.log('-----CONFIRMATION_BOX-----');
      cy.get('div.ant-confirm-content').contains(`2 Sessions for $${this.prices.fullHour * 2}.00`);
      cy.get('button').contains('OK').click({force: true});

      cy.log('=======check that client3Last inventory shows -1 for half hour=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client3Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='halfHour']`).contains('-1');

      cy.log('=======check that verification has changed client=======');
      cy.navTo('Trainer Verification');
      cy.get('tr.ant-table-row').should('have.class', 'row-in-arrears');
      cy.get('.ant-table-row > :nth-child(2)').contains(client3).should('exist');
      cy.get('.ant-table-row > :nth-child(2)').contains('halfHour').should('exist');
    });
  });

  describe.only('When editing date on an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      cy.route({
        method: 'GET',
        url: '/fetchAllClients'
      }).as('fetchAllClients');
      cy.route({
        method: 'GET',
        url: '/trainerVerification/fetchUnverifiedAppointments'
      }).as('fetchUnverifiedAppointments');
      cy.route({
        method: 'POST',
        url: '/appointment/updateAppointmentFromPast'
      }).as('updateAppointmentFromPast');
      cy.route({
        method: 'GET',
        url: '/purchaselist/fetchpurchases/*'
      }).as('fetchpurchases');


      cy.createAppointment(aDT.appointmentDate, aDT.time, client1, 'Full Hour');

      cy.log('=======change appointment date=======');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();
      cy.dataId('date-container', 'div').find('input').click();
      // cy.get(`td[title='${aDT.day.add(1, 'day').format('DD/MM/YYYY')}']`)
      const newMoment = Cypress.moment(aDT.day).subtract(1, 'day');
      cy.get(`[title="${newMoment.format('MM/DD/YYYY')}"] > .ant-calendar-date`).click();
      // cy.get('#date').blur();
      cy.get('form').submit();

      cy.log('=======check thatclient1Lastnventory shows -1 for full hour=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client1Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('-1');

      cy.log('=======check that verification is not possible but new day shows=======');
      cy.navTo('Trainer Verification');
      cy.get('.ant-table-row').should('have.class', 'row-in-arrears');
      // cy.get('tr.ant-table-row td').contains(aDT.day.add(1, 'day').format('MM/DD/YYYY')).should('exist');
      cy.get('.ant-table-row > :nth-child(3)').contains(newMoment.format('MM/DD/YYYY')).should('exist');
      cy.log('=======purchase two full hour sessions forclient1Last======');
      cy.goToPurchasesList(client1Last);
      cy.get('.contentHeader__button__new').click();
      cy.dataId('fullHour-container', 'div').find('input').type(2);
      cy.get('form').submit();

      cy.log('=======check that inventory shows only 1=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client1Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('1');

      cy.log('=======check that one session is used and one available=======');
      cy.goToPurchasesList(client1Last);
      cy
        .get('tr.ant-table-row-level-0:last')
        .find('td')
        .contains(this.prices.fullfHour * 2)
        .should('exist')
        .closest('tr')
        .find('.ant-table-row-expand-icon')
        .click();
      cy.get('tr.ant-table-expanded-row-level-1')
        .find('tr.ant-table-row-level-0')
        .should('have.length', 2);
      cy.get('tr.row-gray').should('have.length', 1);

      cy.log('=======check that verification is now possible=======');
      cy.navTo('Trainer Verification');
      cy.get('.ant-table-row').should('not.have.class', 'row-in-arrears');

      cy.log('=======change appointment date again=======');
      cy.get('span.menu__item__leaf__link').contains('Calendar').click();
      cy.log('======SWITCH TO LAST WEEK======');
      if (Cypress.moment().day === 1) {
        cy.get('.redux__task__calendar__header__date__nav > :nth-child(1)').click();
      }
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();
      cy.dataId('date-container', 'div').find('input').click();
      const newMoment2 = Cypress.moment(aDT.day).subtract(2, 'day');
      cy.get(`[title="${newMoment2.format('MM/DD/YYYY')}"] > .ant-calendar-date`).click();


      cy.log('=======check that inventory still shows only 1=======');
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.wait('@fetchAllClients');
      cy
        .get('.ant-table-row-level-0')
        .find('span')
        .contains(client1Last)
        .closest('tr')
        .find('td:first div.list__cell__link')
        .click();
      cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('1');

      cy.log('=======check that one session is used with proper date=======');
      cy.goToPurchasesList(client1Last);
      cy
        .get('tr.ant-table-row-level-0:last')
        .find('td')
        .contains(this.prices.fullfHour * 2)
        .should('exist')
        .closest('tr')
        .find('.ant-table-row-expand-icon')
        .click();
      cy.get('tr.ant-table-expanded-row-level-1')
        .find('tr.ant-table-row-level-0')
        .should('have.length', 2);
      cy.get('tr.row-gray').find('td').contains(newMoment2.format('MM/DD/YYYY'));

      cy.log('=======check that verification is propper date=======');
      cy.navTo('Trainer Verification');
      cy.get('.ant-table-row').find('td').contains(newMoment2.format('MM/DD/YYYY'));

      //
      // fund ahern for half hour and move to new day and change to ahern
      // move to future and check verification, inventory etc
      // move back to past and check verification inventory etc
    });
  });

  describe.skip('When editing an existing appointment in the past', () => {
    it('Should allow you to persist all edits', function() {
      cy.createAppointment(aDT.appointmentDate, aDT.time, client1, 'Full Hour');
      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get(`.form__footer__button`).contains('Edit').click();

      cy.get('#clients').click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains(client1)
        .click();
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains(client2)
        .click();

      cy.get('#appointmentType').click({force: true});
      cy
        .get('.ant-select-dropdown-menu-item')
        .contains('Full Hour')
        .click();

      cy.get('#notes').type('By! Everybody!');

      cy.get('form').submit();

      cy.clickOnAppointment(aDT.appointmentDate, aDT.time);
      cy.get('ul[data-id=clients] li').contains(client2);
      cy.get('span[data-id=appointmentType]').contains('Full Hour');
      cy.get('span[data-id=date]').contains(aDT.day.format('MM/DD/YYYY'));
      cy.get('span[data-id=startTime]').contains(aDT.time);
      cy.get('span[data-id=notes]').contains('By! Everybody!');
    });
  });

});
