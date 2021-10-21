export function login(user) {
  const { username, password } = user;

  cy.testId('navbar-login-btn').click();
  cy.testId('username').type(username);
  cy.testId('password').type(password);
  cy.testId('login-btn').click();
  cy.testId('navbar-user', { timeout: 1000 }).should('be.visible');
  cy.getCookie('connect.sid').should('exist');
}

export function logout() {
  cy.testId('navbar-user').click();
  cy.testId('logout-btn').click();
  cy.testId('navbar-login-btn', { timeout: 1000 }).should('be.visible');
  cy.getCookie('connect.sid').should('not.exist');
}
