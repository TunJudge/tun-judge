import { login } from '../../helpers';
import { AdminPage } from '../../objects';

describe('Admin Navbar', () => {
  beforeEach(() => {
    cy.visit('/');
    login('admin');
  });

  it('should be visible', () => {
    const adminNavbar = new AdminPage().navbar;
    adminNavbar.shouldBeVisible();
    adminNavbar.sidebarToggle.shouldBeVisible();
    adminNavbar.activeContestSelector.shouldBeVisible();
    adminNavbar.userMenu.shouldBeVisible();
    adminNavbar.userMenu.rootElement.should('have.text', 'Super Admin');
    adminNavbar.darkModeSwitch.shouldBeVisible();
  });

  it('should switch on/off dark mode', () => {
    cy.get('.dark').should('not.exist');
    new AdminPage().navbar.darkModeSwitch.click();
    cy.get('.dark').should('exist');
  });
});
