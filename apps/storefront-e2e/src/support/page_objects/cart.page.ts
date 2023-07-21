import { CartEntryFragment } from '../page_fragments/cart-entry.fragment';
import { CartTotalsFragment } from '../page_fragments/cart-totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class CartPage extends AbstractSFPage {
  url = '/cart';

  private cartTotals = new CartTotalsFragment();

  waitForLoaded(): void {
    this.getEmptyCartMessageWrapper().should('be.visible');
  }

  getCartEntriesWrapper = () => cy.get('oryx-cart-entries');
  getEmptyCartMessageWrapper = () => cy.get('oryx-content-text');
  getEmptyCartMessage = () =>
    this.getEmptyCartMessageWrapper().contains('Your shopping cart is empty');
  getCartEntries = () =>
    this.getCartEntriesWrapper()
      .find('oryx-cart-entry')
      .then(($elements) => {
        return cy.wrap(
          $elements.toArray().map(($el) => new CartEntryFragment($el))
        );
      });
  getCartEntriesHeading = () =>
    this.getCartEntriesWrapper().find('oryx-heading');
  getCartTotals = () => this.cartTotals;
  getCheckoutBtn = () => cy.contains('oryx-button', 'Checkout').find('a');
  getDeleteModal = () => this.getCartEntriesWrapper().find('oryx-modal');
  getSubmitDeleteBtn = () =>
    this.getDeleteModal().find('oryx-button[slot="footer-more"]');

  checkout = () => {
    this.getCheckoutBtn().click();
  };
}
