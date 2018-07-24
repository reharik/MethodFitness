const _routines = require('../../helpers/routines');
const setupRoutes = require('../../helpers/setupRoutes');
const _aDT = require('../../fixtures/appointments');
const appTimes = require('../../helpers/appointmentTimes');
let aDT;
let appointmentValues;

describe('Trainer Can Not See Admin Stuff', () => {
  let routines;

  beforeEach(() => {
    setupRoutes(cy);
    routines = _routines(cy, Cypress, Cypress.moment);
    cy.fixture('trainers').as('trainers');
    cy.fixture('clients').as('clients');
  });

  describe('landing on calendar page', () => {
    it('should not be able to see or do admin stuff', function() {
      let trainer = this.trainers.trainer3;
      routines.loginTrainer({
        index: 1,
        trainer,
      });
      cy.visit('/');
      cy.wait('@fetchAppointments');
      cy.get('toggleTrainerListForCalendar__container').should('not.exist');

      aDT = _aDT(Cypress.moment, appTimes.time15);
      const newDate = Cypress.moment(aDT.day).subtract(2, 'day');

      routines.navToAppropriateWeek(aDT.date);
      cy.get(
        `ol[data-id='${aDT.date.format('ddd MM/DD')}'] li[data-id='${
          aDT.time
        }']`,
      ).click();

      cy.dataId('trainerId', 'span').contains(trainer.LNF);
      cy.dataId('trainerId-container', 'div').should('not.exist');

      // check that only trainers clients show
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client3.LNF)
        .get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client1.LNF)
        .get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client4.LNF);
      cy.get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client2.LNF)
        .should('not.exist');
      cy.get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client5.LNF)
        .should('not.exist');
      cy.get('#clients').blur();

      //test that date before now is not available to click
      cy.log(`----changing date----`);
      cy.dataId('date-container', 'div')
        .find('input')
        .click();
      //checking for "disabled" class
      cy.get(
        `[title="${newDate.format('MM/DD/YYYY')}"].ant-calendar-disabled-cell`,
      ).should('exist');

      cy.get('button')
        .contains('Cancel')
        .click({ force: true });

      //test that start times begin now.
      cy.get(
        `ol[data-id='${Cypress.moment().format(
          'ddd MM/DD',
        )}'] li[data-id='${Cypress.moment()
          .add(4, 'hour')
          .startOf('hour')
          .format('h:mm A')}']`,
      ).click();

      cy.dataId('startTime-container', 'div').click();
      cy.get('ul.ant-select-dropdown-menu')
        .first('li.ant-select-dropdown-menu-item')
        .contains(
          Cypress.moment()
            .add(1, 'hour')
            .startOf('hour')
            .format('h:mm A'),
        );
      cy.get('.ant-select-selection--single').blur();

      cy.get('button')
        .contains('Cancel')
        .click({ force: true });

      // test that you get correct error message when trying to click time in past
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      cy.get(
        `ol[data-id='${aDT.date.format('ddd MM/DD')}']
 li[data-id='${aDT.time}'] .redux__task__calendar__tasks`,
      ).click();

      cy.get('div.ant-confirm-body span').contains(
        'You can not set an appointment in the past',
      );
      cy.get('button')
        .contains('OK')
        .click({ force: true });
    });
  });

  describe('when trainer is in app', () => {
    it('should see the right stuff in menu', function() {
      let trainer = this.trainers.trainer3;
      routines.loginTrainer({
        index: 1,
        trainer,
      });
      cy.visit('/');
      cy.get('.menu__item__leaf__link')
        .contains('Trainers')
        .should('not.exist');
    });
  });

  describe('when trainer is in clients view', () => {
    it('should see the right stuff in client list', function() {
      let trainer = this.trainers.trainer3;
      routines.loginTrainer({
        index: 1,
        trainer,
      });
      cy.visit('/');
      cy.navTo('Clients');

      cy.get('.ant-table-row').should('have.lengthOf', 3);
      cy.get('.ant-table-row')
        .find('span')
        .contains(this.clients.client3.LN)
        .should('exist');
      cy.get('.ant-table-row')
        .find('span')
        .contains(this.clients.client1.LN)
        .should('exist');
      cy.get('.ant-table-row')
        .find('span')
        .contains(this.clients.client4.LN)
        .should('exist');

      cy.get('span')
        .contains('Show All')
        .should('not.exist');
      cy.get('.ant-table-thead')
        .contains('Archived')
        .should('not.exist');
    });
  });

  describe('when trainer is in purchase view', () => {
    it('should see the right stuff in list', function() {
      let trainer = this.trainers.trainer3;
      routines.loginTrainer({
        index: 1,
        trainer,
      });
      cy.visit('/');
      routines.purchaseSessions({
        index: 1,
        client: this.clients.client3,
      });
      cy.get('#purchaseList')
        .contains('Submit Refund')
        .should('not.exist');
    });
  });
});
