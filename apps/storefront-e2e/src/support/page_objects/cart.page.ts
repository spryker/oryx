import { CartEntryFragment } from '../page_fragments/cart-entry.fragment';
import { CartTotalsFragment } from '../page_fragments/cart-totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class CartPage extends AbstractSFPage {
  url = '/cart';

  private cartTotals = new CartTotalsFragment();

  waitForLoaded(): void {
    this.getCartEntriesWrapper().should('be.visible');
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
}
