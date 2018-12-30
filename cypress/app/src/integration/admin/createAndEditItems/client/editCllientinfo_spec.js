const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit an existing client contact info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('clients').as('clients');
  });

  describe('When editing client info', () => {
    it('should pass all steps', function() {
      const client = this.clients.client1;
      const newClient = this.clients.newClient;
      const newDate = Cypress.moment(client.birthDate).add(1, 'day');
      cy.navTo('Clients');
      cy.wait('@fetchAllClients').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(client.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getClient');
      cy.wait(500);
      cy.dataId('clientInfo', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#firstName')
        .clear()
        .type(newClient.firstName);
      cy.get('#lastName')
        .clear()
        .type(newClient.lastName);
      routines.selectDate({
        dateContainerName: 'birthDate-container',
        newDate,
      });
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('firstName', 'span').contains(newClient.firstName);
      cy.dataId('lastName', 'span').contains(newClient.lastName);
      cy.dataId('birthDate', 'span').contains(newDate.format('MM/DD/YYYY'));
    });
  });

  describe('When editing client info end erasing all values', () => {
    it('should pass all steps', function() {
      const client = this.clients.client1;
      cy.navTo('Clients');
      cy.wait('@fetchAllClients').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(client.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getClient');
      cy.wait(500);
      cy.dataId('clientInfo', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#firstName').clear();
      cy.get('#lastName').clear();

      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();

      cy.dataId('firstName-container', 'div')
        .find('div.ant-form-explain')
        .contains('firstName is required');
      cy.dataId('lastName-container', 'div')
        .find('div.ant-form-explain')
        .contains('lastName is required');
    });
  });
});
