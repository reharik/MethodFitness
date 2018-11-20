const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit an existing trainer address info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('trainers').as('trainers');
  });

  describe('When editing trainer address', () => {
    it('should pass all steps', function() {
      const trainer = this.trainers.trainer1;
      const newTrainer = this.trainers.newTrainer;
      cy.navTo('Trainers');
      cy.wait('@fetchAllTrainers').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(trainer.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer');
      cy.wait(500);
      cy.dataId('trainerAddress', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#street1')
        .clear()
        .type(newTrainer.street1);
      cy.get('#street2')
        .clear()
        .type(newTrainer.street2);
      cy.get('#city')
        .clear()
        .type(newTrainer.city);
      cy.get('#state').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(newTrainer.state)
        .click();
      cy.get('#zipCode')
        .clear()
        .type(newTrainer.zipCode);
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('street1', 'span').contains(newTrainer.street1);
      cy.dataId('street2', 'span').contains(newTrainer.street2);
      cy.dataId('city', 'span').contains(newTrainer.city);
      cy.dataId('state', 'span').contains(newTrainer.state);
      cy.dataId('zipCode', 'span').contains(newTrainer.zipCode);
    });
  });
});
