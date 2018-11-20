const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit existing trainer client rates', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    // routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('trainers').as('trainers');
    cy.fixture('clients').as('clients');
  });

  describe('When editing trainer client rates', () => {
    it('should pass all steps', function() {
      const trainer = this.trainers.trainer1;
      const client = this.clients.client5;
      cy.navTo('Trainers');
      cy.wait('@fetchAllTrainers').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(trainer.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer');
      cy.wait(500);
      cy.dataId('trainerClientRate', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get(`input#${client.id}`)
        .clear()
        .type(25);
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId(client.id, 'span').contains(25);
    });
  });

  describe('When entering null for TCR', () => {
    it('should pass all steps', function() {
      const trainer = this.trainers.trainer1;
      const client = this.clients.client5;
      cy.navTo('Trainers');
      cy.wait('@fetchAllTrainers').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(trainer.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer');
      cy.wait(500);
      cy.dataId('trainerClientRate', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get(`input#${client.id}`).clear();
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();

      cy.get(`input#${client.id}`)
        .find('div.ant-form-explain')
        .contains('Rate is required');
    });
  });
});
