import { CartEntryFragment } from '../page-fragments/cart-entry.fragment';
import { CartTotalsFragment } from '../page-fragments/cart-totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class CartPage extends AbstractSFPage {
  url = '/cart';

  private cartTotals = new CartTotalsFragment();

  waitForLoaded(): void {
    // TODO: this check will be improved in the followup PR
    // this.getEmptyCartMessage().should('be.visible');
  }

  getCartEntriesWrapper = () => cy.get('oryx-cart-entries');
  getEmptyCartMessage = () => cy.get('oryx-content-text');
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
  getCheckoutBtn = () =>
    cy.get('oryx-checkout-link').find('oryx-button').find('a');
  getDeleteModal = () => this.getCartEntriesWrapper().find('oryx-modal');
  getSubmitDeleteBtn = () =>
    this.getDeleteModal().find('oryx-button[slot="footer-more"]');

  checkout = () => {
    this.getCheckoutBtn().click({ force: true });
  };

  hasEmptyCart = () => {
    this.getEmptyCartMessage()
      .contains('Your shopping cart is empty')
      .should('be.visible');
    this.getCartEntriesWrapper().should('not.be.visible');
    this.getCartTotals().getWrapper().should('not.be.visible');
  };
}
