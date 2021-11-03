import { PageElement } from '../common';

export class AdminSidebar extends PageElement {
  itemsTitlesShouldBe(visible: boolean) {
    this.rootElement.testId('admin-sidebar-item-title').should(visible ? 'exist' : 'not.exist');
  }

  getItem(item: string) {
    item = item.toLowerCase().replace(/ +/, '-');
    return this.rootElement.testId(`admin-sidebar-item-${item}`);
  }

  clickItem(item: string) {
    this.getItem(item).click();
  }
}
