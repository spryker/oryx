import { PickerFragment } from '../page_fragments/picker.fragment';
import { ProductFragment } from '../page_fragments/product.fragment';
import { AbstractFAPage } from './abstract.page';

export class PickerPage extends AbstractFAPage {
  constructor(protected id: string) {
    super();
  }

  pickerFragment = new PickerFragment();
  productFragment = new ProductFragment();

  url = `/picking-list/picking/${this.id}`;

  getNotPickedTab = () => this.pickerFragment.getTabsList().eq(0);
  getPickedTab = () => this.pickerFragment.getTabsList().eq(1);
  getNotFoundTab = () => this.pickerFragment.getTabsList().eq(2);

  getNotPickedProductsNumber = () =>
    cy.wrap(this.getProductsNumber(this.getNotPickedTab()));
  getPickedProductsNumber = () =>
    cy.wrap(this.getProductsNumber(this.getPickedTab()));
  getNotFoundProductsNumber = () =>
    cy.wrap(this.getProductsNumber(this.getNotFoundTab()));

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
      this.productFragment.getQuantityInputField().clear().type(itemsNumber);

      // click submit button
      this.productFragment.getSubmitButton().click();
    });
  }

  insideTabContent(tab, callback) {
    tab.invoke('attr', 'for').then((tabId) => {
      this.pickerFragment.getTabById(tabId).click();

      this.pickerFragment.getTabContentById(tabId).within((scopeEl) => {
        callback(scopeEl);
      });
    });
  }
}
