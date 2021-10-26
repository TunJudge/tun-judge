/// <reference path="../../support/types.d.ts" />
import { login } from '../../helpers';

describe('Authentication', () => {
  beforeEach(() => cy.visit('/'));

  it('anonymous user should be able to turn on dark mode', () => {
    cy.get('.dark').should('not.exist');
    cy.testId('dark-mode-switch').click();
    cy.get('.dark').should('exist');
    cy.testId('dark-mode-switch').click();
    cy.get('.dark').should('not.exist');
  });

  ['admin', 'team'].forEach((user) =>
    it(`${user} user should be able to turn on dark mode`, () => {
      cy.fixture('users.json').then((users) => login(users[user]));
      cy.get('.dark').should('not.exist');
      cy.testId('dark-mode-switch').click();
      cy.get('.dark').should('exist');
      cy.testId('dark-mode-switch').click();
      cy.get('.dark').should('not.exist');
    })
  );
});
