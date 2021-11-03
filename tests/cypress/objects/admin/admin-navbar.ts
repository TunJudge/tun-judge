import { PageElement } from '../common';

export class AdminNavbar extends PageElement {
  get sidebarToggle() {
    return new PageElement('admin-sidebar-toggle');
  }

  get activeContestSelector() {
    return new PageElement('active-contest-selector');
  }

  get userMenu() {
    return new PageElement('admin-user-menu');
  }

  get darkModeSwitch() {
    return new PageElement('dark-mode-switch');
  }
}
