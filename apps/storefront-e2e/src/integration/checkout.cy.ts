import { CartPage } from '../support/page_objects/cart.page';
import { CheckoutPage } from '../support/page_objects/checkout.page';
import { ThankYouPage } from '../support/page_objects/thank-you.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';
import { ProductStorage } from '../test-data/product.storage';
import { TestCustomerData } from '../types/user.type';

let sccosApi: SCCOSApi;
let thankYouPage: ThankYouPage;
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

// TODO: refactor tests to make them more readable
// TODO: add a test for an order with different shipping and billing addresses set

describe('Checkout suite', () => {
  describe('Create a new order by authorized user without addresses', () => {
    beforeEach(() => {
      cy.login();

      sccosApi = new SCCOSApi();

      cy.fixture<TestCustomerData>('test-customer').then((customer) => {
        cy.customerCartsCleanup(sccosApi, customer);
        cy.customerAddressesCleanup(sccosApi, customer);
      });
    });

    it('must allow user to create a new order', () => {
      const productData = ProductStorage.getProductByEq(2);

      cy.fixture<TestCustomerData>('test-customer').then((customer) => {
        sccosApi.carts
          .customersGet(customer.id)
          .its('body.data[0].id')
          .as('cartId');
      });

      cy.get<string>('@cartId').then((cartId) => {
        sccosApi.cartItems.post(productData, 1, cartId);
      });

      cy.intercept('POST', '/checkout').as('checkout');
      cy.intercept('/customers/*/addresses').as('addresses');

      cartPage.visit();
      cartPage.checkout();

      cy.location('pathname').should('be.eq', checkoutPage.url);
      cy.wait('@addresses');

      checkoutPage.shipping.addAddressForm.fillAddressForm();
      checkoutPage.getPlaceOrderBtn().click();

      cy.wait('@checkout')
        .its('response.body.data.attributes.orderReference')
        .as('createdOrderId');

      cy.get<string>('@createdOrderId').then((id) => {
        thankYouPage = new ThankYouPage(id);

        cy.location('pathname').should('contain', id);

        // check that correct data is shown on thank you page
        thankYouPage
          .getHeading()
          .should('be.visible')
          .and('contain', 'Thank you');

        thankYouPage.getConfirmationBannerText().should('contain', id);

        thankYouPage
          .getOrderDetails()
          .should('be.visible')
          .and('contain', id)
          .and('not.contain', 'Email')
          .and('contain', 'Billing address')
          .and('contain', 'Delivery address');

        // check that the cart is cleared
        thankYouPage.header.getCartCount().should('not.exist');
        thankYouPage.header.getCartSummary().click();

        cartPage.getEmptyCartMessage().should('be.visible');
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
      cartPage.checkout();

      cy.location('pathname').should('be.eq', checkoutPage.anonymousUrl);

      checkoutPage.checkoutAsGuestForm.fillForm();
      checkoutPage.shipping.addAddressForm.fillAddressForm();
      checkoutPage.getPlaceOrderBtn().click();

      cy.wait('@checkout')
        .its('response.body.data.attributes.orderReference')
        .as('createdOrderId');

      cy.get<string>('@createdOrderId').then((id) => {
        thankYouPage = new ThankYouPage(id);

        cy.location('pathname').should('contain', id);

        // check that correct data is shown on thank you page
        thankYouPage
          .getHeading()
          .should('be.visible')
          .and('contain', 'Thank you');

        thankYouPage.getConfirmationBannerText().should('contain', id);

        thankYouPage
          .getOrderDetails()
          .should('be.visible')
          .and('contain', id)
          .and('not.contain', 'Email')
          .and('not.contain', 'Billing address')
          .and('not.contain', 'Delivery address');

        // check that the cart is cleared
        thankYouPage.header.getCartCount().should('not.exist');
        thankYouPage.header.getCartSummary().click();

        cartPage.getEmptyCartMessage().should('be.visible');
      });
    });
  });
});
