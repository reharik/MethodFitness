const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');

describe('Edit existing trainer general info', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('trainers').as('trainers');
  });

  describe('When editing trainer contact', () => {
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
      cy.dataId('trainerContact', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });
      cy.get('#firstName')
        .clear()
        .type(newTrainer.firstName);
      cy.get('#lastName')
        .clear()
        .type(newTrainer.lastName);
      cy.get('#mobilePhone')
        .clear()
        .type(newTrainer.mobilePhone);
      cy.get('#secondaryPhone')
        .clear()
        .type(newTrainer.secondaryPhone);
      cy.get('#email')
        .clear()
        .type(newTrainer.email);
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
      cy.wait(500);

      cy.dataId('firstName', 'span').contains(newTrainer.firstName);
      cy.dataId('lastName', 'span').contains(newTrainer.lastName);
      cy.dataId('mobilePhone', 'span').contains(newTrainer.mobilePhone);
      cy.dataId('secondaryPhone', 'span').contains(newTrainer.secondaryPhone);
      cy.dataId('email', 'span').contains(newTrainer.email);
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
      cy.dataId('trainerContact', 'div')
        .find(`.form__footer__button`)
        .contains('Edit')
        .click({
          force: true,
        });

      cy.get('#firstName').clear();
      cy.get('#lastName').clear();
      cy.get('#mobilePhone').clear();
      cy.get('#secondaryPhone').clear();
      cy.get('#email').clear();
      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click();
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
    });
  });
});
