import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ThankYouPage } from '../support/page-objects/thank-you.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';
import { Customer } from '../support/types/user.type';

let api: GlueAPI;
let thankYouPage: ThankYouPage;
const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

// TODO: refactor tests to make them more readable
// TODO: add a test for an order with different shipping and billing addresses set

describe('Checkout suite', () => {
  describe('Create a new order by authorized user without addresses', () => {
    beforeEach(() => {
      cy.loginApi();

      api = new GlueAPI();

      cy.fixture<Customer>('test-customer').then((customer) => {
        cy.customerCartsCleanup(api, customer);
        cy.customerAddressesCleanup(api, customer);
      });

      const productData = ProductStorage.getByEq(1);

      cy.fixture<Customer>('test-customer').then((customer) => {
        api.carts.customersGet(customer.id).its('body.data[0].id').as('cartId');
      });

      cy.get<string>('@cartId').then((cartId) => {
        api.cartItems.post(productData, 1, cartId);
      });

      cy.intercept('/assets/addresses/*.json').as('addressesRequest');
      cy.goToCheckout();
      cy.wait('@addressesRequest');

      checkoutPage.shipping.addAddressForm.fillAddressForm();
    });

    it('must allow user to create a new order', { tags: 'smoke' }, () => {
      cy.intercept('POST', '/checkout').as('checkout');
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

        cartPage.checkEmptyCart();
      });
    });

    describe('Global notification', () => {
      beforeEach(() => {
        cy.failApiCall(
          {
            method: 'POST',
            url: '/checkout*',
          },
          () => {
            checkoutPage.getPlaceOrderBtn().click();
          }
        );
      });

      it('should show a notification if BE error occurs while creating order', () => {
        cy.checkGlobalNotificationAfterFailedApiCall(checkoutPage);
      });
    });
  });

  describe('Create a new order by guest user', { tags: 'smoke' }, () => {
    beforeEach(() => {
      api = new GlueAPI();
      api.guestCarts.get();
    });

    it('must allow user to create a new order', () => {
      cy.addItemsToTheGuestCart(api, 1, ProductStorage.getByEq(4));

      cy.goToGuestCheckout();

      checkoutPage.checkoutAsGuestForm.fillForm();
      checkoutPage.shipping.addAddressForm.fillAddressForm();

      cy.intercept('POST', '/checkout?include=orders').as('checkout');
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

        cartPage.checkEmptyCart();
      });
    });
  });
});
