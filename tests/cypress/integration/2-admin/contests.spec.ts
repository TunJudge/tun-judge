import { login } from '../../helpers';
import { AdminPage } from '../../objects';

describe('Admin Contests', () => {
  beforeEach(() => {
    cy.visit('/');
    login('admin');
    new AdminPage().sidebar.clickItem('Contests');
  });

  it('should show the list of existing contests', () => {
    const adminPage = new AdminPage();
    adminPage.contests.tableHeaders
      .then((elems) => Cypress._.map(Cypress.$.makeArray(elems), 'innerText'))
      .should('deep.equal', [
        '#',
        'Short Name',
        'Name',
        'Active Time',
        'Start Time',
        'End Time',
        'Enabled?',
        'Public?',
        'Teams',
        'Problems',
        'Actions',
      ]);
  });
});
