// const _routines = require('../../../helpers/routines');
// const setupRoutes = require('../../../helpers/setupRoutes');
// const _aDT = require('../../../fixtures/appointments');
// const appTimes = require('../../../helpers/appointmentTimes');
//
// describe('Archive Trainer', () => {
//   let routines;
//
//   beforeEach(() => {
//     setupRoutes(cy);
//     routines = _routines(cy, Cypress, Cypress.moment);
//     cy.fixture('trainers').as('trainers');
//     routines.loginAdmin({});
//     cy.visit('/');
//     cy.navTo('Trainers');
//   });
//
//   describe('clicking archive', () => {
//     it('should should archive the trainer', function() {
//       // archive trainer
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer2.LN)
//         .closest('tr')
//         .find('td')
//         .contains('Archive')
//         .click();
//       // check not in list
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer2.LN)
//         .should('not.exist');
//       // go to archived list
//       cy.get('span')
//         .contains('Archived')
//         .click();
//       // chekc that archived trainer in list
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer2.LN)
//         .should('exist');
//       // go to show all
//       cy.get('span')
//         .contains('Show All')
//         .click();
//       // should show the archived trainer in there
//       cy.get('.ant-table-row-level-0').should('have.lengthOf', 3);
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer2.LN)
//         .should('exist');
//
//       // check that trainer is not in dropdown for appointment
//       cy.navTo('Calendar');
//       const aDT = _aDT(Cypress.moment, appTimes.time1);
//       cy.get(
//         `ol[data-id='${aDT.date.format('ddd MM/DD')}'] li[data-id='${
//           aDT.time
//         }']`,
//       ).click();
//       cy.get('#trainers').click();
//       cy.get('.ant-select-dropdown-menu-item')
//         .contains(this.trainers.trainer2.LNF)
//         .should('not.exist');
//       cy.get('[type="reset"]').click({
//         force: true,
//       });
//
//       // return to trainers
//       cy.navTo('Trainers');
//       // got to show all find archived trainer and click unarchived
//       cy.get('span')
//         .contains('Show All')
//         .click();
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer2.LN)
//
//         .closest('tr')
//         .find('td')
//         .contains('Unarchive')
//         .click();
//       // check that the formerly archived trainer is now not archived
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer2.LN)
//         .closest('tr')
//         .find('td')
//         .contains('Archive')
//         .should('exist');
//       // check that there are no trainers in archived list
//       cy.get('span')
//         .contains('Archived')
//         .click();
//       cy.get('.ant-table-placeholder')
//         .contains('No data')
//         .should('exist');
//     });
//     it('should should not archive trainer if currently logged in', function() {
//       // archive trainer
//       cy.get('.ant-table-row-level-0 td')
//         .contains(this.trainers.trainer1.LN)
//         .closest('tr')
//         .find('td')
//         .contains('Archive')
//         .click();
//       cy.get('div.ant-confirm-body span').contains(
//         'You can not set an appointment in the past',
//       );
//     });
//   });
// });
