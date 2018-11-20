const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit an existing client address info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('clients').as('clients');
  });

  describe('When editing client address', () => {
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
      cy.dataId('clientAddress', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#street1')
        .clear()
        .type(newClient.street1);
      cy.get('#street2')
        .clear()
        .type(newClient.street2);
      cy.get('#city')
        .clear()
        .type(newClient.city);
      cy.get('#state').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(newClient.state)
        .click();
      cy.get('#zipCode')
        .clear()
        .type(newClient.zipCode);
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('street1', 'span').contains(newClient.street1);
      cy.dataId('street2', 'span').contains(newClient.street2);
      cy.dataId('city', 'span').contains(newClient.city);
      cy.dataId('state', 'span').contains(newClient.state);
      cy.dataId('zipCode', 'span').contains(newClient.zipCode);
    });
  });
});
