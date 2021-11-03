/// <reference path="../../support/types.d.ts" />
import { login, logout } from '../../helpers';
import { AdminPage } from '../../objects';

describe('Authentication', () => {
  beforeEach(() => cy.visit('/'));

  describe('happy path', () => {
    afterEach(() => logout());

    it('should login and logout successfully using the admin account', () => {
      login('admin');
      new AdminPage().sidebar.shouldBeVisible();
    });

    it('should login and logout successfully using the jury account', () => login('jury'));

    it('should login and logout successfully using the team account', () => login('team'));
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
