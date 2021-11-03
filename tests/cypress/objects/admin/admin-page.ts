import { EntityPage } from '../common';
import { AdminNavbar } from './admin-navbar';
import { AdminSidebar } from './admin-sidebar';

export class AdminPage {
  constructor() {
    cy.testId('admin-page', { timeout: 1000 });
  }

  get sidebar(): AdminSidebar {
    return new AdminSidebar('admin-sidebar');
  }

  get navbar(): AdminNavbar {
    return new AdminNavbar('admin-navbar');
  }

  get contests(): EntityPage {
    return new EntityPage('admin-contests-tab');
  }
}
