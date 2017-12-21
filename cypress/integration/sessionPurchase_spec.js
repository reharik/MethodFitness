/* eslint-disable no-undef */
describe('Session Purchase', () => {
  const aDT = require('./../fixtures/appointments')(Cypress.moment, '1:00 PM', true);
    before(() => {
      // cy.on('window:before:load', (win) => {
      //   Object.defineProperty(win, 'ga', {
      //     configurable: false,
      //     writeable: false,
      //     fetch: null
      //   })
      // })
    })

    beforeEach(() => {
      cy.loginAdmin();
      cy.deleteAllAppointments();
      cy.visit('/');
      cy.fixture('prices').as('prices');
    });

    describe('When clicking on purchases for a client row', () => {
      it('Should take you to session purchases page', function() {
        cy.get('span.menu__item__leaf__link').contains('Clients').click();
        const row = cy.get('.ant-table-row-level-0').find('span').contains('Barr').closest('tr');
        row.find('td:last div.list__cell__link').click();
        cy.location('pathname').should('contain', '/purchases');
      });
    });

    describe('When clicking on add new purchase', () => {
      it('Should take you to session purchase form', function() {
        cy.get('span.menu__item__leaf__link').contains('Clients').click();
        const row = cy.get('.ant-table-row-level-0').find('span').contains('Barr').closest('tr');
        row.find('td:last div.list__cell__link').click();
        cy.get('.contentHeader__button__new').click();
        cy.location('pathname').should('contain', '/purchase/');
      });
    });

    describe('When entering new items to purchase', () => {
      it('Should add up the total correctly and submit successfully', function() {
        const total = (
          this.prices.fullHour
          + this.prices.fullHourTenPack
          + this.prices.halfHour
          + this.prices.halfHourTenPack
          + this.prices.pair
          + this.prices.pairTenPack)
          * 2;
        const clientName = 'Barr';
        cy.goToPurchaseSessionForm(clientName);
        cy.log('-----FULL_HOUR-----');
        cy.dataId('fullHour-container', 'div').find('input').type(2);
        cy.dataId('fullHour-container', 'div').next('div').contains(this.prices.fullHour * 2);
        cy.dataId('purchaseTotal', 'div').find('h3').contains(this.prices.fullHour * 2);
        cy.log('-----FULL_HOUR_TEN_PACK-----');
        cy.dataId('fullHourTenPack-container', 'div').find('input').type(2);
        cy.dataId('fullHourTenPack-container', 'div').next('div').contains(this.prices.fullHourTenPack * 2);
        cy.dataId('purchaseTotal', 'div').find('h3').contains((
          this.prices.fullHour
          + this.prices.fullHourTenPack)
          * 2);
        cy.log('-----HALF_HOUR-----');
        cy.dataId('halfHour-container', 'div').find('input').type(2);
        cy.dataId('halfHour-container', 'div').next('div').contains(this.prices.halfHour * 2);
        cy.dataId('purchaseTotal', 'div').find('h3').contains(
          (this.prices.fullHour
          + this.prices.fullHourTenPack
          + this.prices.halfHour)
          * 2);
        cy.log('-----HALF_HOUR_TEN_PACK-----');
        cy.dataId('halfHourTenPack-container', 'div').find('input').type(2);
        cy.dataId('halfHourTenPack-container', 'div').next('div').contains(this.prices.halfHourTenPack * 2);
        cy.dataId('purchaseTotal', 'div').find('h3').contains((
          this.prices.fullHour
          + this.prices.fullHourTenPack
          + this.prices.halfHour
          + this.prices.halfHourTenPack)
          * 2);
        cy.log('-----PAIR-----');
        cy.dataId('pair-container', 'div').find('input').type(2);
        cy.dataId('pair-container', 'div').next('div').contains(this.prices.pair * 2);
        cy.dataId('purchaseTotal', 'div').find('h3').contains((
          this.prices.fullHour
          + this.prices.fullHourTenPack
          + this.prices.halfHour
          + this.prices.halfHourTenPack
          + this.prices.pair)
          * 2);
        cy.log('-----PAIR_TEN_PACK-----');
        cy.dataId('pairTenPack-container', 'div').find('input').type(2);
        cy.dataId('pairTenPack-container', 'div').next('div').contains(this.prices.pairTenPack * 2);

        cy.log('-----CHECK_PURCHASE_TOTAL-----');
        cy.dataId('purchaseTotal', 'div').find('h3').contains(total);
        cy.get('form').submit();
        cy.location('pathname').should('contain', '/purchase/');

        cy.log('-----CHECK_PURCHASE_ROW_IN_TABLE-----');
        cy
          .get('tr.ant-table-row-level-0:last')
          .find('td')
          .contains(total)
          .should('exist');

        cy.log('-----CHECK_CLIENT_INVENTORY-----');
        cy.dataId('returnToClient', 'a').click();
        cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('22');
        cy.dataId('clientInventory', 'div').find(`span[data-id='halfHour']`).contains('22');
        cy.dataId('clientInventory', 'div').find(`span[data-id='pair']`).contains('22');

        cy.log('-----REFUND_ALL_SESSIONS-----');
        cy.dataId('purchases', 'a').click();
        cy
          .get('tr.ant-table-row-level-0:last')
          .find('td')
          .contains(total)
          .should('exist')
          .closest('tr')
          .find('.ant-table-row-expand-icon')
          .click();
        cy.get('.ant-table-thead input').click();
        cy.get('button').contains('Submit Refund').click();

        cy.log('-----CONFIRMATION_BOX-----');
        cy.get('div.ant-confirm-content').contains(`66 Sessions for $${total}.00`);
        cy.get('button').contains('OK').click();

        cy.log('-----CHECK_CLIENT_INVENTORY_SECOND_TIME-----');
        cy.get('span.menu__item__leaf__link').contains('Clients').click();
        cy
          .get('.ant-table-row-level-0')
          .find('span')
          .contains(clientName)
          .closest('tr')
          .find('td:first div.list__cell__link')
          .click();
        cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('0');
        cy.dataId('clientInventory', 'div').find(`span[data-id='halfHour']`).contains('0');
        cy.dataId('clientInventory', 'div').find(`span[data-id='pair']`).contains('0');

      });
    });

    describe('When making purchase after unfunded appointment', () => {
      it('Should set one session as used for unfunded appointment', function() {
        const clientName = 'Barr';

        cy.deleteAllAppointments();
        cy.createAppointment(aDT.appointmentDate, aDT.time, 'Barr Sarah', 'Full Hour');

        cy.log('-----CHECK_CLIENT_INVENTORY-----');
        cy.get('span.menu__item__leaf__link').contains('Clients').click();
        cy
          .get('.ant-table-row-level-0')
          .find('span')
          .contains(clientName)
          .closest('tr')
          .find('td:first div.list__cell__link')
          .click();

        // cy.dataId('clientInventory', 'div').find(`span[data-id='fullHour']`).contains('-1');

        cy.goToPurchaseSessionForm(clientName);

        cy.log('-----PURCHASE_2_SESSIONS-----');
        cy.dataId('fullHour-container', 'div').find('input').type(2);
        cy.get('form').submit();
        cy.location('pathname').should('contain', '/purchase/');

        cy.log('-----CHECK_FOR_USED_SESSION-----');
        // cy gets all rows (or all tds wtfe) and the looks and can't find.
        // needs to wait till all rows (or tds) arrive before initial get.
        cy.wait(2000);
        cy
          .get('tr.ant-table-row-level-0')
          .find('td')
          .contains(this.prices.fullHour * 2)
          .closest('tr')
          .find('.ant-table-row-expand-icon')
          .click();
        cy.get('tr.row-gray').should('have.length', 1);

        cy.deleteAllAppointments();

        cy.log('-----CHECK_SESSION_RETURNED-----');
        cy.goToPurchasesList(clientName);
        cy
          .get('tr.ant-table-row-level-0:last')
          .find('.ant-table-row-expand-icon')
          .click();
        cy.get('tr.row-gray').should('not.exist');

      });
    });
})
