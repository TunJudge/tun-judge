import { PageElement } from './page-element';

export class EntityPage extends PageElement {
  get tableHeaders() {
    return this.rootElement.get('[test-id=data-table-header] > tr > th');
  }
}
