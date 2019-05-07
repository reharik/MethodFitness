const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit existing client contact', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('clients').as('clients');
  });

  describe('When editing client contact', () => {
    it('should pass all steps', function() {
      const client = this.clients.client1;
      const newClient = this.clients.newClient;
      cy.navTo('Clients');
      cy.wait('@fetchAllClients').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(client.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getClient');
      cy.wait(500);
      cy.dataId('clientContact', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#mobilePhone')
        .clear()
        .type(newClient.mobilePhone);
      cy.get('#secondaryPhone')
        .clear()
        .type(newClient.secondaryPhone);
      cy.get('#email')
        .clear()
        .type(newClient.email);
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('mobilePhone', 'span').contains(newClient.mobilePhone);
      cy.dataId('secondaryPhone', 'span').contains(newClient.secondaryPhone);
      cy.dataId('email', 'span').contains(newClient.email);
    });
  });

  describe('When editing client contact end erasing all values', () => {
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
      cy.dataId('clientContact', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#mobilePhone').clear();
      cy.get('#secondaryPhone').clear();
      cy.get('#email').clear();
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.dataId('mobilePhone-container', 'div')
        .find('div.ant-form-explain')
        .contains('mobilePhone is required');
      cy.dataId('email-container', 'div')
        .find('div.ant-form-explain')
        .contains('email is required');
    });
  });
});
