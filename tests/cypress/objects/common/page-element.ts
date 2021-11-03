export class PageElement {
  rootElement: Cypress.Chainable<Element>;

  constructor(testId: string, timeout = 1000) {
    this.rootElement = cy.testId(testId, { timeout });
  }

  click(): Cypress.Chainable<Element> {
    return this.rootElement.click();
  }

  shouldBeVisible(): Cypress.Chainable<Element> {
    return this.rootElement.should('be.visible');
  }

  shouldHaveClasses(className: string): Cypress.Chainable<Element> {
    return this.rootElement.should('have.class', className);
  }
}
