import { CartEntryFragment } from '../page-fragments/cart-entry.fragment';
import { TotalsFragment } from '../page-fragments/totals.fragment';
import { visibilityCheck } from '../utils';
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
    cy.get('oryx-cart-heading').find('oryx-heading');
  getCartTotals = () => new TotalsFragment('oryx-cart-totals');
  getCheckoutBtn = () =>
    cy.get('oryx-checkout-link').find('oryx-button').find('a');
  getDeleteModal = () => this.getCartEntriesWrapper().find('oryx-modal');
  getSubmitDeleteBtn = () =>
    this.getDeleteModal().find('oryx-button[slot="footer-more"]');

  getCouponComponent = () => cy.get('oryx-cart-coupon');
  getCouponInput = () => this.getCouponComponent().find('input');
  getCouponInputError = () =>
    this.getCouponComponent().find('oryx-error-message');
  getCouponBtn = () =>
    this.getCouponComponent().find('oryx-input').find('oryx-button');
  getCouponCode = () => this.getCouponComponent().find('div');
  getRemoveCouponBtn = () => this.getCouponCode().find('oryx-button');
  getCouponDate = () => this.getCouponComponent().find('oryx-date');
  getCouponNotification = () => cy.get('oryx-notification');

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

  templateIsReady = () => {
    //heading is ready
    this.getCartEntriesHeading().should('be.visible');

    //entries are ready
    this.getCartEntriesWrapper()
      .find('oryx-cart-entry')
      .find('oryx-product-title')
      .should('be.visible');

    //totals are ready
    visibilityCheck(this.getCartTotals().getWrapper()).then(() => {
      this.getCartTotals().getSubtotalPrice().should('be.visible');
      this.getCartTotals().getDiscountsWrapper().should('be.visible');
      this.getCartTotals().getTaxTotalPrice().should('be.visible');
      this.getCartTotals().getTotalPrice().should('be.visible');
    });

    //checkout button is ready
    this.getCheckoutBtn().should('be.visible');

    //coupon input is ready
    this.getCouponInput().should('be.visible');
  };
}
