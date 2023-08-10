import { CartEntryFragment } from '../page-fragments/cart-entry.fragment';
import { TotalsFragment } from '../page-fragments/totals.fragment';
import { AbstractSFPage } from './abstract.page';

export class CartPage extends AbstractSFPage {
  url = '/cart';

  waitForLoaded(): void {
    this.getCartEntriesWrapper().should('exist');
  }

  getCartEntriesWrapper = () => cy.get('oryx-cart-entries');
  getEmptyCartMessage = () => cy.contains('Your shopping cart is empty');
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
  getCartTotals = () => new TotalsFragment('oryx-cart-totals');
  getCheckoutBtn = () =>
    cy.get('oryx-checkout-link').find('oryx-button').find('a');
  getDeleteModal = () => this.getCartEntriesWrapper().find('oryx-modal');
  getSubmitDeleteBtn = () =>
    this.getDeleteModal().find('oryx-button[slot="footer-more"]');

  checkout = () => {
    this.getCheckoutBtn().click({ force: true });
  };

  checkEmptyCart = () => {
    this.getEmptyCartMessage().should('be.visible');
    this.getCartEntriesWrapper().should('not.be.visible');
    this.getCartTotals().getWrapper().should('not.be.visible');
  };

  checkNotEmptyCart = () => {
    this.getEmptyCartMessage().should('not.exist');
    this.getCartEntriesWrapper().should('be.visible');
    this.getCartTotals().getWrapper().should('be.visible');
  };

  approveCartEntryDeletion = () => {
    cy.intercept({
      method: 'DELETE',
      url: '/guest-carts/*/guest-cart-items/*',
    }).as('deleteCartItemRequest');

    this.getSubmitDeleteBtn().click();

    cy.wait('@deleteCartItemRequest');
  };
}
