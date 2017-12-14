/* eslint-disable no-undef */
describe('Session Purchase', () => {
  beforeEach(() => {
    cy.loginAdmin();
    cy.visit('/');
  });

  describe('When clicking on menuItem Clients', () => {
    it('Should take you to clients page', function() {
      cy.get('span.menu__item__leaf__link').contains('Clients').click();
      cy.location('pathname').should('equal', '/clients');
    });
  });
});
