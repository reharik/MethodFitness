describe('Auth', () => {
  beforeEach(() => {
    cy.fixture('users').as('users');
  });

  it('Should be able to login: admin', function() {
    const { userName, password } = this.users.admin;
    cy.visit('/');
    cy.get('input[name=userName]').type(userName);
    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`);

    // we should be redirected to /calendar
    cy.location('pathname').should('eq', '/');
    cy.get('#mainCalendar').should('be.visible');

    // UI should reflect this user being logged in
    cy.get('#userName').should('contain', userName);
  });

  it('sets auth cookie when logging in via form submission', function() {
    const { userName, password } = this.users.admin;

    cy.visit('/');
    cy.get('input[name=userName]').type(userName);
    // {enter} causes the form to submit
    cy.get('input[name=password]').type(`${password}{enter}`);

    // we should be redirected to /calendar
    cy.location('pathname').should('eq', '/');
    cy.get('#mainCalendar').should('be.visible');

    // our auth cookie should be present
    cy.getCookie('MethodFitness.sid').should('exist');

    // UI should reflect this user being logged in
    cy.get('#userName').should('contain', userName);
  });

  it('logs in programmatically without using the UI', function() {
    const { userName, password } = this.users.admin;
    // programmatically log us in without needing the UI
    cy.request('POST', `http://${process.env.API_HOST}/auth`, {
      userName,
      password,
    });
    // now that we're logged in, we can visit
    // any kind of restricted route!
    cy.visit('/');

    // our auth cookie should be present
    cy.getCookie('MethodFitness.sid').should('exist');

    // UI should reflect this user being logged in
    cy.get('#userName').should('contain', userName);
  });

  it('Should be able to logout', function() {
    routines.loginAdmin({});
    cy.visit('/');
    cy.get(`a[data-id='signOut']`).click();
    cy.dataId('signInContainer', 'div').should('exist');
  });
});
