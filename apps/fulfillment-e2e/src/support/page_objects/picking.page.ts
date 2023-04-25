import { PickingProductFragment } from '../page_fragments/picking-product.fragment';
import { PickingFragment } from '../page_fragments/picking.fragment';
import { AbstractFAPage } from './abstract.page';

export class PickingPage extends AbstractFAPage {
  constructor(protected id: string) {
    super();
  }

  pickingFragment = new PickingFragment();
  pickingProductFragment = new PickingProductFragment();

  url = `/picking-list/picking/${this.id}`;

  getNotPickedTabId() {
    return this.pickingFragment.getTabsList().eq(0);
  }

  getNotPickedTab() {
    return this.pickingFragment.getTabsList().eq(0);
  }
  getPickedTab() {
    return this.pickingFragment.getTabsList().eq(1);
  }
  getNotFoundTab() {
    return this.pickingFragment.getTabsList().eq(2);
  }

  insideTabContent(tab, callback) {
    tab.invoke('attr', 'for').then((tabId) => {
      this.pickingFragment.getTabById(tabId).click();

      this.pickingFragment.getTabContentById(tabId).within(() => {
        callback(tabId);
      });
    });
  }

  checkTabProductsCount(tab, count: number) {
    this.insideTabContent(tab, () => {
      if (count === 0) {
        this.pickingProductFragment.getProducts().should('not.exist');
      } else {
        this.pickingProductFragment.getProducts().then((products) => {
          cy.wrap(products).should('have.length', count);
        });
      }
    });
  }
}
