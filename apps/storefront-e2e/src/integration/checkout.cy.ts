import { ProductStorage } from '../data-storages/product.storage';
import { defaultUser } from '../support/commands';
import { CartPage } from '../support/page_objects/cart.page';
import { CheckoutPage } from '../support/page_objects/checkout.page';
import { ThankYouPage } from '../support/page_objects/thank-you.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';

let sccosApi: SCCOSApi;
let thankYouPage: ThankYouPage;
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('Checkout authorized user suite', () => {
  describe('Create a new order by authorized user without address', () => {
    beforeEach(() => {
      cy.login(defaultUser);

      sccosApi = new SCCOSApi();

      cy.customerCartsCleanup(sccosApi, defaultUser);
      cy.customerAddressesCleanup(sccosApi, defaultUser);
    });

    it('must allow user to create a new order', () => {
      const productData = ProductStorage.getProductByEq(2);

      sccosApi.carts
        .customersGet(defaultUser.id)
        .its('body.data[0].id')
        .as('cartId');

      cy.get<string>('@cartId').then((cartId) => {
        sccosApi.cartItems.post(productData, 1, cartId);
      });

      cy.intercept('POST', '/checkout').as('checkout');
      cy.intercept('/customers/*/addresses').as('addresses');

      cartPage.visit();
      cartPage.getCheckoutBtn().click({ force: true });

      cy.location('pathname').should('be.eq', checkoutPage.url);
      cy.wait('@addresses');

      checkoutPage.fillAddressForm();
      checkoutPage.getPlaceOrderBtn().click();

      cy.wait('@checkout')
        .its('response.body.data.attributes.orderReference')
        .as('createdOrderId');

      cy.get<string>('@createdOrderId').then((id) => {
        thankYouPage = new ThankYouPage(id);

        thankYouPage.getHeading().should('be.visible');
        cy.location('pathname').should('contain', id);
        thankYouPage.getBannerOrderId().should('contain', id);
        thankYouPage.getOrderDetails().should('contain', id);
        thankYouPage.getOrderDetails().contains('Billing address');
        thankYouPage.getOrderDetails().contains('Delivery address');
      });
    });
  });
});

describe('Checkout guest user suite', () => {
  describe('Create a new order by guest user', () => {
    beforeEach(() => {
      sccosApi = new SCCOSApi();
      sccosApi.guestCarts.get();
    });

    it('must allow user to create a new order', () => {
      const productData = ProductStorage.getProductByEq(2);

      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);

      cy.intercept('POST', '/checkout').as('checkout');
      cy.intercept('/customers/*/addresses').as('addresses');

      cartPage.visit();
      cartPage.getCheckoutBtn().click({ force: true });

      cy.location('pathname').should('be.eq', checkoutPage.url);
      checkoutPage.getCheckoutAsGuestBtn().click();

      checkoutPage.fillUserContactForm();
      checkoutPage.fillAddressForm();
      checkoutPage.getPlaceOrderBtn().click();

      cy.wait('@checkout')
        .its('response.body.data.attributes.orderReference')
        .as('createdOrderId');

      cy.get<string>('@createdOrderId').then((id) => {
        thankYouPage = new ThankYouPage(id);

        thankYouPage
          .getHeading()
          .should('be.visible')
          .and('contain', 'Thank You');
        cy.location('pathname').should('contain', id);
        thankYouPage.getBannerOrderId().should('contain', id);
        thankYouPage.getOrderDetails().should('contain', id);
        //TODO: Add checks for Billing Address and Delivery Address should not exist
        //thankYouPage.getOrderDetails().should('not.exist');
      });
    });
  });
});
