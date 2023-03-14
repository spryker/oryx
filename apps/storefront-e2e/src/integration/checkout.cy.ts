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

describe('Checkout suite', () => {
  describe('Create a new order by authorized user without addresses', () => {
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

        cy.location('pathname').should('contain', id);

        thankYouPage
          .getHeading()
          .should('be.visible')
          .and('contain', 'Thank you');

        thankYouPage.getConfirmationBannerText().should('contain', id);

        thankYouPage
          .getOrderDetails()
          .should('be.visible')
          .and('contain', id)
          .and('contain', 'Billing address')
          .and('contain', 'Delivery address');
      });
    });
  });

  describe('Create a new order by guest user', () => {
    beforeEach(() => {
      sccosApi = new SCCOSApi();
      sccosApi.guestCarts.get();
    });

    it('must allow user to create a new order', () => {
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(1), 1);

      cy.intercept('POST', '/checkout?include=orders').as('checkout');
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

        cy.location('pathname').should('contain', id);

        thankYouPage
          .getHeading()
          .should('be.visible')
          .and('contain', 'Thank you');

        thankYouPage.getConfirmationBannerText().should('contain', id);

        thankYouPage
          .getOrderDetails()
          .should('be.visible')
          .and('contain', id)
          .and('contain', 'Billing address')
          .and('contain', 'Delivery address');
      });
    });
  });
});
