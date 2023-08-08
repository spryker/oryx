import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ThankYouPage } from '../support/page-objects/thank-you.page';

const cartPage = new CartPage();
const checkoutPage = new CheckoutPage();

describe('Checkout suite', () => {
  describe('for guest user: ', () => {
    beforeEach(() => {
      const api = new GlueAPI();

      cy.createGuestCart(api);
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

        thankYouPage.getOrderEntriesWrapper().should('be.visible');
        thankYouPage.getOrderEntries().should('have.length.at.least', 1);

        thankYouPage.orderTotalsFragment.getWrapper().should('not.exist');

        verifyThatCartWasCleared();
      });
    });
  });
  describe('for authenticated user: ', () => {
    beforeEach(() => {
      const api = new GlueAPI();

      cy.loginApi(api);
      cy.customerCleanup(api);
      cy.addProductToCart(api);
      cy.addAddress(api);
      cy.goToCheckout();
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

        thankYouPage.getOrderEntriesWrapper().should('be.visible');
        thankYouPage.getOrderEntries().should('have.length.at.least', 1);

        thankYouPage.orderTotalsFragment.getWrapper().should('be.visible');
        thankYouPage.orderTotalsFragment
          .getSubtotalPrice()
          .shadow()
          .should('contain.text', '€106.80');
        thankYouPage.orderTotalsFragment
          .getDiscountsTotal()
          .shadow()
          .should('contain.text', '-€29.90');
        thankYouPage.orderTotalsFragment
          .getTaxTotalPrice()
          .shadow()
          .should('contain.text', '€13.06');
        thankYouPage.orderTotalsFragment
          .getTotalPrice()
          .shadow()
          .should('contain.text', '€81.80');
        thankYouPage.orderTotalsFragment
          .getTaxMessage()
          .should('contain.text', 'Tax included');

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
});

function verifyThatCartWasCleared() {
  cartPage.visit();

  cartPage.header.checkCartCount(0);
  cartPage.checkEmptyCart();
}
