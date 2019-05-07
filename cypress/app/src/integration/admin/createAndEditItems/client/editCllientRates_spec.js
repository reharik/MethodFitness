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

  describe('When editing client rates', () => {
    it('should pass all steps', function() {
      routines.changeClientRates({
        index: 1,
        client: this.clients.client1,
        fullHour: 5,
        fullHourTenPack: 5,
        halfHour: 5,
        halfHourTenPack: 5,
        pair: 5,
        pairTenPack: 5,
        halfHourPair: 5,
        halfHourPairTenPack: 5,
        fullHourGroup: 5,
        fullHourGroupTenPack: 5,
        halfHourGroup: 5,
        halfHourGroupTenPack: 5,
        fortyFiveMinute: 5,
        fortyFiveMinuteTenPack: 5,
      });

      cy.dataId('fullHour', 'span').contains(5);
      cy.dataId('fullHourTenPack', 'span').contains(5);
      cy.dataId('halfHour', 'span').contains(5);
      cy.dataId('halfHourTenPack', 'span').contains(5);
      cy.dataId('pair', 'span').contains(5);
      cy.dataId('pairTenPack', 'span').contains(5);
      cy.dataId('halfHourPair', 'span').contains(5);
      cy.dataId('halfHourPairTenPack', 'span').contains(5);
      cy.dataId('fullHourGroup', 'span').contains(5);
      cy.dataId('fullHourGroupTenPack', 'span').contains(5);
      cy.dataId('halfHourGroup', 'span').contains(5);
      cy.dataId('halfHourGroupTenPack', 'span').contains(5);
      cy.dataId('fortyFiveMinute', 'span').contains(5);
      cy.dataId('fortyFiveMinuteTenPack', 'span').contains(5);
    });
  });
});
