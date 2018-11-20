const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;

describe('Create a new Client', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('clients').as('clients');
  });

  describe('When creating new client and filling out ALL the fields', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const client = this.clients.newClient;
      cy.navTo('Clients');
      cy.get('.contentHeader__button__new').click();
      cy.get('#firstName').type(client.firstName);
      cy.get('#lastName').type(client.lastName);
      cy.get('#mobilePhone').type(client.mobilePhone);
      cy.get('#secondaryPhone').type(client.secondaryPhone);
      cy.get('#email').type(client.email);
      routines.selectDate({
        newDate: aDT.date,
        dateContainerName: 'birthDate-container',
      });

      cy.get('#street1').type(client.street1);
      cy.get('#street2').type(client.street2);
      cy.get('#city').type(client.city);
      cy.get('#state').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(client.state)
        .click();
      cy.get('#zipCode').type(client.zipCode);
      cy.get('#sourceNotes').type(client.sourceNotes);

      cy.get('#source').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(client.source)
        .click();

      routines.selectDate({
        newDate: aDT.date,
        dateContainerName: 'startDate-container',
      });
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click({
          force: true,
        });
      // needs to render after fetch
      cy.wait('@fetchAllClients').wait(2000);
      cy.get('.ant-table-row-level-0 span')
        .contains('LikesIt')
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getClient');
      cy.dataId('firstName', 'span').contains(client.firstName);
      cy.dataId('lastName', 'span').contains(client.lastName);
      cy.dataId('mobilePhone', 'span').contains(client.mobilePhone);
      cy.dataId('secondaryPhone', 'span').contains(client.secondaryPhone);
      cy.dataId('email', 'span').contains(client.email);
      cy.dataId('street1', 'span').contains(client.street1);
      cy.dataId('street2', 'span').contains(client.street2);
      cy.dataId('city', 'span').contains(client.city);
      cy.dataId('state', 'span').contains(client.state);
      cy.dataId('zipCode', 'span').contains(client.zipCode);
      cy.dataId('source', 'span').contains(client.source);
      cy.dataId('sourceNotes', 'span').contains(client.sourceNotes);
      cy.dataId('birthDate', 'span').contains(aDT.date.format('MM/DD/YYYY'));
      cy.dataId('startDate', 'span').contains(aDT.date.format('MM/DD/YYYY'));
    });
  });

  describe('When creating new client with only the REQUIRED the fields', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const client = this.clients.newClient;
      cy.navTo('Clients');
      cy.get('.contentHeader__button__new').click();
      cy.get('#firstName').type(client.firstName);
      cy.get('#lastName').type(client.lastName);
      cy.get('#mobilePhone').type(client.mobilePhone);
      cy.get('#email').type(client.email);

      routines.selectDate({
        newDate: aDT.date,
        dateContainerName: 'startDate-container',
      });
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click({
          force: true,
        });
      // needs to render after fetch
      cy.wait('@fetchAllClients').wait(2000);
      cy.get('.ant-table-row-level-0 span')
        .contains('LikesIt')
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getClient');
      cy.dataId('firstName', 'span').contains(client.firstName);
      cy.dataId('lastName', 'span').contains(client.lastName);
      cy.dataId('mobilePhone', 'span').contains(client.mobilePhone);
      cy.dataId('email', 'span').contains(client.email);
      cy.dataId('startDate', 'span').contains(aDT.date.format('MM/DD/YYYY'));
    });
  });

  describe('When creating new client with NO fields entered', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const client = this.clients.newClient;
      cy.navTo('Clients');
      cy.get('.contentHeader__button__new').click();
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click({
          force: true,
        });

      cy.dataId('firstName-container', 'div')
        .find('div.ant-form-explain')
        .contains('firstName is required');
      cy.dataId('lastName-container', 'div')
        .find('div.ant-form-explain')
        .contains('lastName is required');
      cy.dataId('mobilePhone-container', 'div')
        .find('div.ant-form-explain')
        .contains('mobilePhone is required');
      cy.dataId('email-container', 'div')
        .find('div.ant-form-explain')
        .contains('email is required');
      cy.dataId('startDate-container', 'div')
        .find('div.ant-form-explain')
        .contains('startDate is required');
    });
  });
});
