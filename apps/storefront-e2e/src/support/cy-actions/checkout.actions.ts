import { CartPage } from '../page-objects/cart.page';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      goToCheckout(): Chainable<void>;
      goToGuestCheckout(): Chainable<void>;
    }
  }
}

const cartPage = new CartPage();

Cypress.Commands.add('goToCheckout', () => {
  cy.goToCart();
  waitForNonEmptyCartToBeLoaded();

  cy.intercept('/customers/*/addresses').as('customerAddressesRequest');
  cartPage.checkout();
  cy.wait('@customerAddressesRequest');
});

Cypress.Commands.add('goToGuestCheckout', () => {
  cy.goToGuestCart();
  waitForNonEmptyCartToBeLoaded();

  cy.intercept('/assets/addresses/*.json').as('addressFormDataRequest');
  cartPage.checkout();
  cy.wait('@addressFormDataRequest');
});

// just open a cart page is not enought to be sure
// that checkout button is clickable
//
// we have to wait for other elements, and even with them
// there is no 100% guarranty that checkout btn is ready
//
// this check should be removed in the future when hydration is improved
function waitForNonEmptyCartToBeLoaded() {
  cartPage.getCartTotals().getTotalPrice().should('be.visible');
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(250);
}
