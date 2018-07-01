module.exports = cy => {
  cy.server();

  cy.route({
    method: 'GET',
    url: '/fetchAllClients',
  }).as('fetchAllClients');

  cy.route({
    method: 'GET',
    url: '/trainerVerification/fetchUnverifiedAppointments',
  }).as('fetchUnverifiedAppointments');

  cy.route({
    method: 'POST',
    url: '/appointment/scheduleAppointment',
  }).as('scheduleAppointment');

  cy.route({
    method: 'POST',
    url: '/appointment/scheduleAppointmentInPast',
  }).as('scheduleAppointmentInPast');

  cy.route({
    method: 'POST',
    url: '/appointment/updateAppointmentFromPast',
  }).as('updateAppointmentFromPast');

  cy.route({
    method: 'GET',
    url: '/purchaselist/fetchpurchases/*',
  }).as('fetchpurchases');

  cy.route({
    method: 'POST',
    url: '/fetchAppointments/*/*',
  }).as('fetchAppointments');

  cy.route({
    method: 'POST',
    url: '/appointment/removeAppointmentFromPast',
  }).as('deletePastAppointment');

  cy.route({
    method: 'GET',
    url: '/client/getClient/*',
  }).as('getClient');

  cy.route({
    method: 'POST',
    url: '/trainerVerification/verifyappointments',
  }).as('verifyappointments');

  cy.route({
    method: 'POST',
    url: '/payTrainer/*',
  }).as('paytrainer');

  cy.route({
    method: 'GET',
    url: '/trainerPayments',
  }).as('trainerpayments');

  cy.route({
    method: 'GET',
    url: '/trainerPaymentDetails/*',
  }).as('trainerpaymentdetails');

  cy.route({
    method: 'POST',
    url: '/purchase/purchase',
  }).as('purchase');

  cy.route({
    method: 'POST',
    url: '/appointment/cancelappointment',
  }).as('cancelappointment');

  cy.route({
    method: 'GET',
    url: '/fetchappointment/*',
  }).as('fetchappointment');

  cy.route({
    method: 'POST',
    url: '/appointment/cleanalltestdata',
  }).as('cleanalltestdata');
};
