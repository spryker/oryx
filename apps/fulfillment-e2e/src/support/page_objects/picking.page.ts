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

  get notPickedTab() {
    return this.pickingFragment.getTabsList().eq(0);
  }
  get pickedTab() {
    return this.pickingFragment.getTabsList().eq(1);
  }
  get notFoundTab() {
    return this.pickingFragment.getTabsList().eq(2);
  }

  get notPickedProductsNumber() {
    return cy.wrap(this.getProductsNumber(this.notPickedTab));
  }
  get pickedProductsNumber() {
    return cy.wrap(this.getProductsNumber(this.pickedTab));
  }
  get notFoundProductsNumber() {
    return cy.wrap(this.getProductsNumber(this.notFoundTab));
  }

  getProductsNumber(tab) {
    return new Promise((resolve) => {
      this.insideTabContent(tab, ($tabContent) => {
        resolve($tabContent.find('oryx-picking-product-card').length);
      });
    });
  }

  pickProduct(product, itemsNumber) {
    product.within(() => {
      // type items number into field
      this.pickingProductFragment
        .getQuantityInputField()
        .clear()
        .type(itemsNumber);

      // click submit button
      this.pickingProductFragment.getSubmitButton().click();
    });
  }

  insideTabContent(tab, callback) {
    tab.invoke('attr', 'for').then((tabId) => {
      this.pickingFragment.getTabById(tabId).click();

      this.pickingFragment.getTabContentById(tabId).within((scopeEl) => {
        callback(scopeEl);
      });
    });
  }
}
