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
      cy.wait('@getdefaultclientrates').wait(500);
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

      cy.get('#fullHour')
        .clear()
        .type(5);
      cy.get('#fullHourTenPack')
        .clear()
        .type(5);
      cy.get('#halfHour')
        .clear()
        .type(5);
      cy.get('#halfHourTenPack')
        .clear()
        .type(5);
      cy.get('#pair')
        .clear()
        .type(5);
      cy.get('#pairTenPack')
        .clear()
        .type(5);
      cy.get('#halfHourPair')
        .clear()
        .type(5);
      cy.get('#halfHourPairTenPack')
        .clear()
        .type(5);
      cy.get('#fullHourGroup')
        .clear()
        .type(5);
      cy.get('#fullHourGroupTenPack')
        .clear()
        .type(5);
      cy.get('#halfHourGroup')
        .clear()
        .type(5);
      cy.get('#halfHourGroupTenPack')
        .clear()
        .type(5);
      cy.get('#fortyFiveMinute')
        .clear()
        .type(5);
      cy.get('#fortyFiveMinuteTenPack')
        .clear()
        .type(5);

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
      cy.dataId('fullHour', 'span').contains(5);
      cy.dataId('fullHourTenPack', 'span').contains(5);
      cy.dataId('halfHour', 'span').contains(5);
      cy.dataId('halfHourTenPack', 'span').contains(5);
      cy.dataId('pair', 'span').contains(5);
      cy.dataId('pairTenPack', 'span').contains(5);
      cy.dataId('halfHourPair', 'span').contains(5);
      cy.dataId('halfHourPairTenPack', 'span').contains(5);
      cy.dataId('fullHourGroup', 'span').contains(5);
      cy.dataId('fullHourGroupTenPack', 'span').contains(5);
      cy.dataId('halfHourGroup', 'span').contains(5);
      cy.dataId('halfHourGroupTenPack', 'span').contains(5);
      cy.dataId('fortyFiveMinute', 'span').contains(5);
      cy.dataId('fortyFiveMinuteTenPack', 'span').contains(5);
    });
  });

  describe('When creating new client with only the REQUIRED the fields', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const client = this.clients.newClient;
      cy.navTo('Clients');
      cy.get('.contentHeader__button__new').click();
      cy.wait('@getdefaultclientrates').wait(500);
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
      cy.navTo('Clients');
      cy.get('.contentHeader__button__new').click();
      cy.wait('@getdefaultclientrates').wait(500);

      cy.get('#fullHour').clear();
      cy.get('#fullHourTenPack').clear();
      cy.get('#halfHour').clear();
      cy.get('#halfHourTenPack').clear();
      cy.get('#pair').clear();
      cy.get('#pairTenPack').clear();
      cy.get('#halfHourPair').clear();
      cy.get('#halfHourPairTenPack').clear();
      cy.get('#fullHourGroup').clear();
      cy.get('#fullHourGroupTenPack').clear();
      cy.get('#halfHourGroup').clear();
      cy.get('#halfHourGroupTenPack').clear();
      cy.get('#fortyFiveMinute').clear();
      cy.get('#fortyFiveMinuteTenPack').clear();

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

      cy.dataId('fullHour-container', 'div')
        .find('div.ant-form-explain')
        .contains('fullHour is required');
      cy.dataId('fullHourTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('fullHourTenPack is required');
      cy.dataId('halfHour-container', 'div')
        .find('div.ant-form-explain')
        .contains('halfHour is required');
      cy.dataId('halfHourTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('halfHourTenPack is required');
      cy.dataId('pair-container', 'div')
        .find('div.ant-form-explain')
        .contains('pair is required');
      cy.dataId('pairTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('pairTenPack is required');
      cy.dataId('halfHourPair-container', 'div')
        .find('div.ant-form-explain')
        .contains('halfHourPair is required');
      cy.dataId('halfHourPairTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('halfHourPairTenPack is required');
      cy.dataId('fullHourGroup-container', 'div')
        .find('div.ant-form-explain')
        .contains('fullHourGroup is required');
      cy.dataId('fullHourGroupTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('fullHourGroupTenPack is required');
      cy.dataId('halfHourGroup-container', 'div')
        .find('div.ant-form-explain')
        .contains('halfHourGroup is required');
      cy.dataId('halfHourGroupTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('halfHourGroupTenPack is required');
      cy.dataId('fortyFiveMinute-container', 'div')
        .find('div.ant-form-explain')
        .contains('fortyFiveMinute is required');
      cy.dataId('fortyFiveMinuteTenPack-container', 'div')
        .find('div.ant-form-explain')
        .contains('fortyFiveMinuteTenPack is required');
    });
  });
});
