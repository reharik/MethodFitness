const _routines = require('../../../../helpers/routines');
const setupRoutes = require('../../../../helpers/setupRoutes');
const _aDT = require('../../../../fixtures/appointments');
const appTimes = require('../../../../helpers/appointmentTimes');
let aDT;

describe('Create a new Trainer', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);

    routines.loginAdmin({});
    cy.visit('/');
    cy.fixture('trainers').as('trainers');
  });

  describe('When creating new trainer and filling out ALL the fields', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const trainer = this.trainers.newTrainer;
      cy.navTo('Trainers');
      cy.get('.contentHeader__button__new').click();
      cy.wait('@fetchclients').wait(500);
      cy.get('#firstName').type(trainer.firstName);
      cy.get('#lastName').type(trainer.lastName);
      cy.get('#mobilePhone').type(trainer.mobilePhone);
      cy.get('#secondaryPhone').type(trainer.secondaryPhone);
      cy.get('#email').type(trainer.email);
      routines.selectDate({
        newDate: aDT.date,
        dateContainerName: 'birthDate-container',
      });

      cy.get('#street1').type(trainer.street1);
      cy.get('#street2').type(trainer.street2);
      cy.get('#city').type(trainer.city);
      cy.get('#state').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(trainer.state)
        .click();
      cy.get('#zipCode').type(trainer.zipCode);

      cy.get('#password').type(trainer.password);
      cy.get('#confirmPassword').type(trainer.password);
      cy.get('#role').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Trainer')
        .click();

      cy.get('#defaultTrainerClientRate').type(
        trainer.defaultTrainerClientRate,
      );
      cy.get('#clients').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains(trainer.clients[0].name)
        .click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(trainer.clients[1].name)
        .click();

      cy.get(`#${trainer.clients[0].id}`).type(trainer.clients[0].rate);
      cy.get(`#${trainer.clients[1].id}`).type(trainer.clients[0].rate);

      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click({
          force: true,
        });
      // needs to render after fetch
      cy.wait('@fetchAllTrainers').wait(2000);
      cy.get('.ant-table-row-level-0 span')
        .contains(trainer.lastName)
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer').wait(2000);
      cy.dataId('firstName', 'span').contains(trainer.firstName);
      cy.dataId('lastName', 'span').contains(trainer.lastName);
      cy.dataId('mobilePhone', 'span').contains(trainer.mobilePhone);
      cy.dataId('secondaryPhone', 'span').contains(trainer.secondaryPhone);
      cy.dataId('email', 'span').contains(trainer.email);
      cy.dataId('street1', 'span').contains(trainer.street1);
      cy.dataId('street2', 'span').contains(trainer.street2);
      cy.dataId('city', 'span').contains(trainer.city);
      cy.dataId('state', 'span').contains(trainer.state);
      cy.dataId('zipCode', 'span').contains(trainer.zipCode);
      cy.dataId('role', 'span').contains('Trainer');
      cy.dataId('defaultTrainerClientRate', 'span').contains(
        trainer.defaultTrainerClientRate,
      );
      cy.dataId('clients', 'ul')
        .find('li')
        .contains(trainer.clients[0].name);
      cy.dataId('clients', 'ul')
        .find('li')
        .contains(trainer.clients[1].name);
      cy.dataId('birthDate', 'span').contains(aDT.date.format('MM/DD/YYYY'));
      cy.dataId(trainer.clients[0].id, 'span').contains(
        trainer.clients[0].rate,
      );
      cy.dataId(trainer.clients[1].id, 'span').contains(
        trainer.clients[0].rate,
      );
    });
  });

  describe('When creating new trainer with only the REQUIRED the fields', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      const trainer = this.trainers.newTrainer;
      cy.navTo('Trainer');
      cy.get('.contentHeader__button__new').click();
      cy.wait('@fetchclients').wait(500);
      cy.get('#firstName').type(trainer.firstName);
      cy.get('#lastName').type(trainer.lastName);
      cy.get('#mobilePhone').type(trainer.mobilePhone);
      cy.get('#email').type(trainer.email);
      cy.get('#password').type(trainer.password);
      cy.get('#confirmPassword').type(trainer.password);
      cy.get('#defaultTrainerClientRate').type(
        trainer.defaultTrainerClientRate,
      );
      cy.get('#role').click({
        force: true,
      });
      cy.get('.ant-select-dropdown-menu-item')
        .contains('Trainer')
        .click();

      cy.get(`.form__footer__button`)
        .contains('Submit')
        .click({
          force: true,
        });
      // needs to render after fetch
      cy.wait('@fetchAllTrainers').wait(2000);
      cy.get('.ant-table-row-level-0 span')
        .contains('LikesIt')
        .closest('tr')
        .find(':nth-child(1) > .list__cell__link > span')
        .click();
      cy.wait('@getTrainer');
      cy.dataId('firstName', 'span').contains(trainer.firstName);
      cy.dataId('lastName', 'span').contains(trainer.lastName);
      cy.dataId('mobilePhone', 'span').contains(trainer.mobilePhone);
      cy.dataId('email', 'span').contains(trainer.email);
      cy.dataId('role', 'span').contains('Trainer');
      cy.dataId('defaultTrainerClientRate', 'span').contains(
        trainer.defaultTrainerClientRate,
      );
    });
  });

  describe('When creating new trainer with NO fields entered', () => {
    it('should pass all steps', function() {
      aDT = _aDT(Cypress.moment, appTimes.time15, true);
      cy.navTo('Trainer');
      cy.get('.contentHeader__button__new').click();
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
      cy.dataId('password-container', 'div')
        .find('div.ant-form-explain')
        .contains('password is required');
      cy.dataId('confirmPassword-container', 'div')
        .find('div.ant-form-explain')
        .contains('confirmPassword is required');
      cy.dataId('role-container', 'div')
        .find('div.ant-form-explain')
        .contains('role is required');
    });
  });
});
