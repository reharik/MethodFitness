const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit an existing trainer password info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('trainers').as('trainers');
  });

  describe('When editing trainer password', () => {
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
      cy.dataId('trainerPassword', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#password')
        .clear()
        .type(newTrainer.password);
      cy.get('#confirmPassword')
        .clear()
        .type(newTrainer.password);
      cy.get('#role').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Admin')
        .click();
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('role', 'span').contains('Admin');
    });
  });

  describe('When editing trainer info end erasing all values', () => {
    it('should pass all steps', function() {
      const trainer = this.trainers.trainer1;
      cy.navTo('Trainers');
      cy.wait('@fetchAllTrainers').wait(1000);
      cy.get('.ant-table-row-level-0 span')
        .contains(trainer.LN)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer');
      cy.wait(500);
      cy.dataId('trainerPassword', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#password').clear();
      cy.get('#confirmPassword').clear();

      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();

      cy.dataId('password-container', 'div')
        .find('div.ant-form-explain')
        .contains('password is required');
      cy.dataId('confirmPassword-container', 'div')
        .find('div.ant-form-explain')
        .contains('confirmPassword is required');
    });
  });
});
