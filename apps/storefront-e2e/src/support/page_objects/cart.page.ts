import { CartEntryFragment } from '../page_fragments/cart-entry.fragment';
import { CartTotalsFragment } from '../page_fragments/cart-totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class CartPage extends AbstractSFPage {
  url = '/cart';

  private cartTotals = new CartTotalsFragment();

  waitForLoadedSSR(): void {
    this.getCartEntriesWrapper().should('be.visible');
  }

  waitForLoadedSPA(): void {
    // TODO: add move accurate check
    this.waitForLoadedSSR();
  }

  getCartEntriesWrapper = () => cy.get('cart-entries');

  getCartEntries = () =>
    this.getCartEntriesWrapper()
      .find('cart-entry')
      .then(($elements) => {
        return cy.wrap(
          $elements.toArray().map(($el) => new CartEntryFragment($el))
        );
      });

  getCartTotals = () => this.cartTotals;
  getCheckoutBtn = () => cy.contains('oryx-content-link', 'Checkout').find('a');
}
