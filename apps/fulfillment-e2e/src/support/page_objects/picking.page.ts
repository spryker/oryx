import { PickerFragment } from '../page_fragments/picker.fragment';
import { ProductCardFragment } from '../page_fragments/product-card.fragment';
import { ProductFragment } from '../page_fragments/product.fragment';
import { AFAPage } from './abstract-fa.page';

export class PickingPage extends AFAPage {
  url = '/picking-list/picking';

  constructor(protected id?: string) {
    super();

    if (id) {
      this.url += `/${this.id}`;
    }
  }

  waitForLoaded = () => {
    this.getProducts().should('have.length.gt', 0);
  };

  pickerFragment = new PickerFragment();
  productFragment = new ProductFragment();

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

  // IDK why do we have 3 (!) finish picking buttons
  // a separate button per tab
  getFinishPickingBtn = () => cy.get('.submit-wrapper oryx-button').eq(0);
  getProducts = () => cy.get('oryx-picking-product-card');

  pickAllProducts = () => {
    this.getProducts().each((el) => {
      const product = new ProductCardFragment(el);

      product.pickAllItems();
    });
  };

  pickSomeProducts = () => {
    this.getProducts().each((el) => {
      const product = new ProductCardFragment(el);

      product.pickOneItem();
    });
  };

  finishPicking = () => {
    this.getFinishPickingBtn().click();
  };

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
