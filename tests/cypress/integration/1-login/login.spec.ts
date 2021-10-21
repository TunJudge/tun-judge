describe('Authentication', () => {
  beforeEach(() => cy.visit('/login'));

  it('should login successfully using the admin account', () => {
    cy.fixture('users.json').then((users) => loginAndLogout(users.admin));
  });

  it('should login successfully using the jury account', () => {
    cy.fixture('users.json').then((users) => loginAndLogout(users.jury));
  });

  it('should login successfully using the team account', () => {
    cy.fixture('users.json').then((users) => loginAndLogout(users.team));
  });
});

function loginAndLogout(user) {
  const { username, password } = user;

  cy.get('*[name=username]').type(username);
  cy.get('*[name=password]').type(password);
  cy.get('.t-login-btn').click();
  cy.get('.t-navbar-user', { timeout: 1000 }).should('be.visible');
  cy.getCookie('connect.sid').should('exist');
  cy.get('.t-navbar-user').click();
  cy.get('.t-logout-btn').click();
  cy.get('.t-navbar-login-btn', { timeout: 1000 }).should('be.visible');
}
