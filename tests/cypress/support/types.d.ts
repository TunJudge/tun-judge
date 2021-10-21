/// <reference types="cypress" />

declare namespace Cypress {
  interface Chainable<Subject = any> {
    /**
     * Custom command to select DOM element by test-id attribute.
     * @example cy.testId('greeting')
     */
    testId(
      value: string,
      options?: Partial<Loggable & Timeoutable & Withinable & Shadow>
    ): Chainable<Element>;
  }
}
