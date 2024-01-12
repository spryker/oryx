import { CartPage } from '../page-objects/cart.page';

export {};

declare global {
  namespace Cypress {
    interface Chainable {
      goToCart(options?: Partial<Cypress.VisitOptions>): Chainable<void>;
      goToGuestCart(options?: Partial<Cypress.VisitOptions>): Chainable<void>;
    }
  }
}

Cypress.Commands.add('goToCart', (options?: Partial<Cypress.VisitOptions>) => {
  openCartPage('/customers/DE--**/carts?**', options);
});

Cypress.Commands.add(
  'goToGuestCart',
  (options?: Partial<Cypress.VisitOptions>) => {
    openCartPage('/guest-carts?**', options);
  }
);

function openCartPage(
  getCartsUrl: string,
  options?: Partial<Cypress.VisitOptions>
) {
  const cartPage = new CartPage();

  cy.intercept(getCartsUrl).as('cartsRequest');
  cartPage.visit(options);
  cy.wait('@cartsRequest');
}
