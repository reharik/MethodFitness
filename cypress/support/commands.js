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

Cypress.on("window:before:load", win => {
  win.fetch = null;
});

Cypress.Commands.add('loginAdmin', () => {
  cy.fixture('users').then((users) => {
    const {userName, password} = users.admin;
    // programmatically log us in without needing the UI
    cy.request('POST', 'localhost:3666/auth', {
      userName,
      password
    });
  });
});

Cypress.Commands.add('clickEmptySlot', (day, time) => {
  Cypress.log();
  cy.log('-----CLICK_EMPTY_SLOT-----');
  const timeSlot = cy.get(`ol[data-id='${day}'] li[data-id='${time}']`);
  timeSlot.click();
});

Cypress.Commands.add('clickOnAppointment', (day, time) => {
  Cypress.log();
  cy.log('-----CLICK_ON_APPOINTMENT-----');
  const appointment = cy.get(`ol[data-id='${day}'] li[data-id='${time}'] .redux__task__calendar__task__item`);
  appointment.click();
});

Cypress.Commands.add('createAppointment', (day, time, client, type, future) => {
  Cypress.log();
  const url = future ? '/appointment/scheduleAppointment' : '/appointment/scheduleAppointmentInPast';
  cy.server();
  cy.route({
    method: 'POST',
    url
  }).as('appointments');
  cy.log('-----CREATE_APPOINTMENT-----');
  cy.clickEmptySlot(day, time);
  cy.get('#clients', { log: false }).click({ log: false });
  cy
    .get('.ant-select-dropdown-menu-item', { log: false })
    .contains(client, { log: false })
    .click({ log: false });
  if (type) {
    cy.get('#appointmentType', { log: false }).focus({ log: false }).click({ log: false, force: true});
    cy
      .get('.ant-select-dropdown-menu-item', { log: false })
      .contains(type, { log: false })
      .click({ log: false });
  }
  cy.get('#notes', { log: false }).type('Hi! Everybody!', { log: false });
  cy.get('form').submit();
  // cy.wait(1000);
  cy.wait('@appointments');
  cy.get('#mainCalendar').should('exist');
  cy
    .get(`ol[data-id='${day}'] li[data-id='${time}'] div.redux__task__calendar__task__item`)
    .should('exist');
});

Cypress.Commands.add('logout', () => {
  Cypress.log();
  cy.log('-----LOGOUT-----');
  cy.get(`a[data-id='signOut']`).click();
});
  
Cypress.Commands.add('dataId', (id, elType) => {
  Cypress.log();
  return cy.get(`${elType}[data-id='${id}']`);
});

Cypress.Commands.add('deleteAppointment', (day, time) => {
  Cypress.log();
  cy.log('-----DELETE_APPOINTMENT-----');
  cy.get('span.menu__item__leaf__link').contains('Calendar').click();
  cy.clickOnAppointment(day.format('ddd MM/DD'), time);
  cy.get(`.form__footer__button`).contains('Delete').click();
});

Cypress.Commands.add('deleteAllAppointments', () => {
  cy.visit('/', { log: false });
  cy.server();
  cy.route({
    method: 'POST',
    url: '/fetchAppointments/*/*'
  }).as('fetchAppointments');
  cy.wait('@fetchAppointments');
  cy.wait(500, { log: false }).then(() => {
    const appointments = Cypress.$(`.redux__task__calendar__task__item`);
    if (appointments.length > 0) {
      cy.wrap(appointments)
        .each(y => {
          let x = cy.wrap(y);
          x.should('exist');
          x.click();
          cy.get(`.form__footer__button`).contains('Delete').click();
        });
    }
    // cy.wait(1000);
    cy.get(`.redux__task__calendar__task__item`).should('not.exist');
  });
});

Cypress.Commands.add('goToPurchasesList', clientLastName => {
  Cypress.log();
  cy.log('-----GO_TO_PURCHASE_LIST-----');
  cy.server();
  cy.route({
    method: 'GET',
    url: '/fetchAllClients'
  }).as('fetchAllClients');
  cy.get('span.menu__item__leaf__link').contains('Clients').click();
  cy.wait('@fetchAllClients');
  const row = cy.get('.ant-table-row-level-0').find('span').contains(clientLastName).closest('tr');
  row.find('td:last div.list__cell__link span').click();
});

Cypress.Commands.add('goToPurchaseSessionForm', (clientLastName) => {
  Cypress.log();
  cy.log('-----GO_TO_PURCHASE_SESSIONS_FORM-----');
  cy.goToPurchasesList(clientLastName);
  cy.get('.contentHeader__button__new').click();
});

Cypress.Commands.add('navTo', (menuItem) => {
  cy.log(`-----NAVIGATE_TO_${menuItem}-----`);
  cy.get('span.menu__item__leaf__link').contains(menuItem).click();
});


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
