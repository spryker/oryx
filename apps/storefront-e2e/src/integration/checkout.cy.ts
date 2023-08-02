import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ThankYouPage } from '../support/page-objects/thank-you.page';
import { Customer } from '../support/types/user.type';

const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('Checkout suite', () => {
  describe('Authorized user without addresses', () => {
    beforeEach(() => {
      // login should be first here
      // because we need to have access token in localstorage
      cy.loginApi();

      const api = new GlueAPI();

      cy.fixture<Customer>('test-customer').then((customer) => {
        cy.customerCartsCleanup(api, customer);
        cy.customerAddressesCleanup(api, customer);
      });

      cy.addProductToCart(api);
      cy.goToCheckout();

      checkoutPage.shipping.addAddressForm.fillAddressForm();
    });

    it('should create a new order successfully', { tags: 'smoke' }, () => {
      checkoutPage.placeOrder();

      cy.get<string>('@createdOrderId').then((id) => {
        const thankYouPage = new ThankYouPage(id);

        thankYouPage.getHeading().should('be.visible');
        thankYouPage.getConfirmationBannerText().should('contain', id);

        thankYouPage
          .getOrderDetails()
          .should('contain', id)
          .and('not.contain', 'Email')
          .and('contain', 'Billing address')
          .and('contain', 'Delivery address');

        verifyThatCartWasCleared();
      });
    });

    it('should show a notification if BE error occurs while creating order', () => {
      cy.failApiCall(
        {
          method: 'POST',
          url: '/checkout*',
        },
        () => checkoutPage.getPlaceOrderBtn().click()
      );

      cy.checkGlobalNotificationAfterFailedApiCall(checkoutPage);
    });
  });

  describe('Guest user', () => {
    beforeEach(() => {
      const api = new GlueAPI();
      api.guestCarts.get();

      cy.addProductToGuestCart(api);
      cy.goToGuestCheckout();

      checkoutPage.checkoutAsGuestForm.fillForm();
      checkoutPage.shipping.addAddressForm.fillAddressForm();
    });

    it('should create a new order successfully', { tags: 'smoke' }, () => {
      checkoutPage.placeOrderAsGuest();

      cy.get<string>('@createdOrderId').then((id) => {
        const thankYouPage = new ThankYouPage(id);

        thankYouPage.getHeading().should('be.visible');
        thankYouPage.getConfirmationBannerText().should('contain', id);

        thankYouPage
          .getOrderDetails()
          .should('contain', id)
          .and('not.contain', 'Email')
          .and('not.contain', 'Billing address')
          .and('not.contain', 'Delivery address');

        verifyThatCartWasCleared();
      });
    });
  });
});

function verifyThatCartWasCleared() {
  cartPage.visit();

  cartPage.header.checkCartCount(0);
  cartPage.checkEmptyCart();
}
