const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit an existing trainer clients info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('trainers').as('trainers');
    cy.fixture('clients').as('clients');
  });

  describe('When editing trainer clients', () => {
    it('should pass all steps', function() {
      const trainer = this.trainers.trainer2;
      const newClient = this.clients.client1;

      cy.navTo('Trainers');
      cy.wait('@fetchAllTrainers').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(trainer.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer');
      cy.wait(500);
      cy.dataId('trainerClients', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });

      cy.dataId('clients-container', 'div')
        .find('li:first > span')
        .click();
      cy.dataId('clients-container', 'div')
        .find('li:first > span')
        .click();
      cy.get('#clients').click({
        force: true,
      });

      cy.get('.ant-select-dropdown-menu-item')
        .contains(newClient.LNF)
        .click();
      cy.get('#clients input').blur();

      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('clients', 'ul')
        .find('li')
        .should('have.length', 2);
      cy.dataId('clients', 'ul')
        .find('li')
        .contains(newClient.LNF);
    });
  });
  //TODO need test to show that TRC changes with client change.  currently broken
});
