import Shadow = Cypress.Shadow;
import Withinable = Cypress.Withinable;
import Timeoutable = Cypress.Timeoutable;
import Loggable = Cypress.Loggable;

Cypress.Commands.add(
  'testId',
  (value: string, options?: Partial<Loggable & Timeoutable & Withinable & Shadow>) => {
    return cy.get(`[test-id=${value}]`, options);
  }
);
