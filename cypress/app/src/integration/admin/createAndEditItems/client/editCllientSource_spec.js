const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit existing client source info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('clients').as('clients');
  });

  describe('When editing client source', () => {
    it('should pass all steps', function() {
      const client = this.clients.client1;
      const newClient = this.clients.newClient;
      const newDate = Cypress.moment(client.startDate).add(1, 'day');
      cy.navTo('Clients');
      cy.wait('@fetchAllClients').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(client.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getClient');
      cy.wait(500);
      cy.dataId('clientSource', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#source').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(newClient.source)
        .click();
      routines.selectDate({
        dateContainerName: 'startDate-container',
        newDate,
      });
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('source', 'span').contains(newClient.source);
      cy.dataId('startDate', 'span').contains(newDate.format('MM/DD/YYYY'));
    });
  });
});
