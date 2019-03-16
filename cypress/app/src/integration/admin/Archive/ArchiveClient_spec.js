const _routines = require('../../../helpers/routines');
const setupRoutes = require('../../../helpers/setupRoutes');
const _aDT = require('../../../fixtures/appointments');
const appTimes = require('../../../helpers/appointmentTimes');

describe('Archive Client', () => {
  let routines;

  beforeEach(() => {
    routines = _routines(cy, Cypress, Cypress.moment);
    routines.cleanDB();
    setupRoutes(cy);
    routines.loginAdmin({});
    cy.fixture('clients').as('clients');
    cy.visit('/');
    cy.navTo('Clients');
  });

  describe('clicking archive', () => {
    it('should should archive the client', function() {
      // archive client
      cy.get('.ant-table-row-level-0 td')
        .contains(this.clients.client1.LN)
        .closest('tr')
        .find('td')
        .contains('Archive')
        .click();
      // check not in list
      cy.get('.ant-table-row-level-0 td')
        .contains(this.clients.client1.LN)
        .should('not.exist');
      // go to archived list
      cy.get('span')
        .contains('Archived')
        .click();
      // chekc that archived client in list
      cy.get('.ant-table-row-level-0 td')
        .contains(this.clients.client1.LN)
        .should('exist');
      // go to show all
      cy.get('span')
        .contains('Show All')
        .click();
      // should show the archived client in there
      cy.get('.ant-table-row-level-0').should('have.lengthOf', 5);
      cy.get('.ant-table-row-level-0 td')
        .contains(this.clients.client1.LN)
        .should('exist');

      // check that client is not in dropdown for appointment
      cy.navTo('Calendar');
      routines.navToAppropriateWeek(Cypress.moment());
      const aDT = _aDT(Cypress.moment, appTimes.time1);
      cy.get(
        `ol[data-id='${aDT.date.format('ddd MM/DD')}'] li[data-id='${
          aDT.time
        }']`,
      ).click();
      cy.get('#clients').click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client1.LNF)
        .should('not.exist');
      cy.get('[type="reset"]').click({
        force: true,
      });

      // check that client is not in dropdown for trainer-clients
      cy.navTo('Trainers');
      cy.get('.contentHeader__button__new').click();
      cy.dataId('clients-container', 'div')
        .find('.ant-select-selection--multiple')
        .click();
      cy.get('.ant-select-dropdown-menu-item')
        .contains(this.clients.client1.LNF)
        .should('not.exist');

      // return to clients
      cy.navTo('Clients');
      // got to show all find archived client and click unarchived
      cy.get('span')
        .contains('Show All')
        .click();
      cy.get('.ant-table-row-level-0 td')
        .contains(this.clients.client1.LN)

        .closest('tr')
        .find('td')
        .contains('Unarchive')
        .click();
      // check that the formerly archived client is now not archived
      cy.get('.ant-table-row-level-0 td')
        .contains(this.clients.client1.LN)
        .closest('tr')
        .find('td')
        .contains('Archive')
        .should('exist');
      // check that there are no clients in archived list
      cy.get('span')
        .contains('Archived')
        .click();
      cy.get('.ant-empty-description')
        .contains('No Data')
        .should('exist');
    });
  });
});
