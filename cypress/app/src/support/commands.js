// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --

Cypress.on('window:before:load', win => {
  win.fetch = null;
});

Cypress.Commands.add('dataId', (id, elType) => {
  Cypress.log();
  return cy.get(`${elType}[data-id='${id}']`);
});

Cypress.Commands.add('navTo', menuItem => {
  cy.log(`-----NAVIGATE_TO_${menuItem}-----`);
  cy.get('span.menu__item__leaf__link')
    .contains(menuItem)
    .click();
});

//
// const navToAppropriateWeek = date => {
//   cy.get('.redux__task__calendar__week input[data-id="startOfWeek"]')
//     .invoke('val')
//     .as('sowValue');
//   cy.get('@sowValue').then(sow => {
//     const startOfWeek = Cypress.moment(sow)
//       .add(1, 'day')
//       .startOf('day');
//     if (date.isBefore(startOfWeek)) {
//       cy.log(`======navigate one week back======`);
//       cy.get(
//         '.redux__task__calendar__header__date__nav > :nth-child(1)',
//       ).click();
//       cy.wait('@fetchAppointments');
//     }
//   });
//
//   cy.get('.redux__task__calendar__week input[data-id="endOfWeek"]')
//     .invoke('val')
//     .as('eowValue');
//   cy.get('@eowValue').then(eow => {
//     const endOfWeek = Cypress.moment(eow)
//       .add(1, 'day')
//       .endOf('day');
//     if (date.isAfter(endOfWeek)) {
//       cy.log(`======navigate one week forward======`);
//       cy.get(
//         '.redux__task__calendar__header__date__nav > :nth-child(2)',
//       ).click();
//       cy.wait('@fetchAppointments');
//     }
//   });
// };

// Cypress.Commands.add('clickEmptySlot', (date, time) => {
//   Cypress.log();
//   cy.log('-----CLICK_EMPTY_SLOT-----');
//   navToAppropriateWeek(date);
//   const timeSlot = cy.get(
//     `ol[data-id='${date.format('ddd MM/DD')}'] li[data-id='${time}']`,
//   );
//   timeSlot.click();
// });

// Cypress.Commands.add('clickOnAppointment', (date, time) => {
//   Cypress.log();
//   cy.log('-----CLICK_ON_APPOINTMENT-----');
//   navToAppropriateWeek(date);
//   const appointment = cy.get(
//     `ol[data-id='${date.format(
//       'ddd MM/DD',
//     )}'] li[data-id='${time}'] .redux__task__calendar__task__item`,
//   );
//   appointment.click();
// });

// Cypress.Commands.add('createAppointment', (day, time, client, type, future) => {
//   Cypress.log();
//   cy.log('-----CREATE_APPOINTMENT-----');
//   cy.clickEmptySlot(day, time);
//   cy.get('#clients').click();
//   cy.get('.ant-select-dropdown-menu-item')
//     .contains(client.LNF)
//     .click();
//   if (type) {
//     cy.get('#appointmentType')
//       .focus({ log: false })
//       .click({ force: true });
//     cy.get('.ant-select-dropdown-menu-item')
//       .contains(type)
//       .click({ log: false });
//   }
//   cy.get('#notes').type('Hi! Everybody!');
//   cy.get('form').submit();
//   // cy.wait(1000);
//   cy.wait(future ? '@scheduleAppointment' : '@scheduleAppointmentInPast');
//   cy.get('#mainCalendar').should('exist');
//   cy.get(
//     `ol[data-id='${day.format(
//       'ddd MM/DD',
//     )}'] li[data-id='${time}'] div.redux__task__calendar__task__item`,
//   ).should('exist');
// });

// Cypress.Commands.add('logout', () => {
//   Cypress.log();
//   cy.log('-----LOGOUT-----');
//   cy.get(`a[data-id='signOut']`).click();
// });

// Cypress.Commands.add('deleteAppointment', (day, time) => {
//   Cypress.log();
//   cy.log('-----DELETE_APPOINTMENT-----');
//   cy.navTo('Calendar');
//   cy.clickOnAppointment(day, time);
//   cy.get(`.form__footer__button`)
//     .contains('Delete')
//     .click();
//   cy.wait('@deletePastAppointment');
// });
//
// Cypress.Commands.add('goToPurchasesList', client => {
//   Cypress.log();
//   cy.log('-----GO_TO_PURCHASE_LIST-----');
//   cy.get('span.menu__item__leaf__link')
//     .contains('Clients')
//     .click();
//   cy.wait('@fetchAllClients');
//   const row = cy
//     .get('.ant-table-row-level-0')
//     .find('span')
//     .contains(client.LN)
//     .closest('tr');
//   row.find('td:last a.list__cell__link span').click();
//   cy.wait('@fetchpurchases').wait(500);
// });

// Cypress.Commands.add('goToPurchaseSessionForm', client => {
//   Cypress.log();
//   cy.log('-----GO_TO_PURCHASE_SESSIONS_FORM-----');
//   cy.goToPurchasesList(client.LN);
//   cy.get('.contentHeader__button__new').click();
// });

//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })
