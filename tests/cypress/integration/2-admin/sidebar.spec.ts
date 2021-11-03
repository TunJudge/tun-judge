import { login } from '../../helpers';
import { AdminPage } from '../../objects';

describe('Admin Sidebar', () => {
  beforeEach(() => {
    cy.visit('/');
    login('admin');
  });

  it('should be open for the first login', () => {
    const adminPage = new AdminPage();
    adminPage.sidebar.shouldBeVisible();
    adminPage.sidebar.shouldHaveClasses('w-72');
  });

  it('should change status when toggling', () => {
    const adminPage = new AdminPage();
    adminPage.sidebar.shouldHaveClasses('w-72');
    adminPage.sidebar.itemsTitlesShouldBe(true);

    adminPage.navbar.sidebarToggle.click();
    adminPage.sidebar.shouldHaveClasses('w-16');
    adminPage.sidebar.itemsTitlesShouldBe(false);
  });

  it('should have items to be clickable', () => {
    const adminPage = new AdminPage();
    [
      'Contests',
      'Problems',
      'Languages',
      'Executables',
      'Users',
      'Teams',
      'Team Categories',
      'Judge Hosts',
      'Submissions',
      'Clarifications',
      'Scoreboard',
    ].forEach((page) => {
      const item = adminPage.sidebar.getItem(page);
      item.should('have.text', page);
      item.click();
      item.should('have.class', 'text-white');
      const kebabCasePage = page.toLowerCase().replace(/ +/, '-');
      cy.location('pathname').should('equal', `/${kebabCasePage}`);
    });
  });
});
