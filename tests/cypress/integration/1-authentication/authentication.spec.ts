/// <reference path="../../support/types.d.ts" />
import { login, logout } from '../../helpers';

describe('Authentication', () => {
  beforeEach(() => cy.visit('/'));

  it('should login and logout successfully using the admin account', () => {
    cy.fixture('users.json').then((users) => login(users.admin));
    logout();
  });

  it('should login and logout successfully using the jury account', () => {
    cy.fixture('users.json').then((users) => login(users.jury));
    logout();
  });

  it('should login and logout successfully using the team account', () => {
    cy.fixture('users.json').then((users) => login(users.team));
    logout();
  });

  it('should fail to login when using wrong credentials', () => {
    cy.testId('navbar-login-btn').click();
    cy.testId('username').type('wrong');
    cy.testId('password').type('credentials');
    cy.testId('login-btn').click();
    cy.testId('error-toast', { timeout: 1000 }).should('be.visible');
    cy.testId('error-toast').contains('The username or password you entered is incorrect');
  });
});
