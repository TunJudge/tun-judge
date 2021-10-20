describe('Authentication', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('/login');
  });

  it('should login successfully using the admin account', () => {
    cy.fixture('users.json').then((users) => login(users.admin));
  });

  it('should login successfully using the jury account', () => {
    cy.fixture('users.json').then((users) => login(users.jury));
  });

  it('should login successfully using the team account', () => {
    cy.fixture('users.json').then((users) => login(users.team));
  });
});

function login(user) {
  const { username, password } = user;

  cy.get('*[name=username]').type(username);
  cy.get('*[name=password]').type(password);
  cy.get('.t-login-btn').click();
  cy.wait(1000);
  cy.getCookie('connect.sid').should('exist');
}
