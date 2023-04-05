import { ProductStorage } from '../data-storages/product.storage';
import { CartPage } from '../support/page_objects/cart.page';
import { LandingPage } from '../support/page_objects/landing.page';
import { ProductDetailsPage } from '../support/page_objects/product-details.page';
import { SCCOSApi } from '../support/sccos_api/sccos.api';

const homePage = new LandingPage();
const cartPage = new CartPage();
const pdp = new ProductDetailsPage();

describe('Locales suite', () => {
  describe('when user opens home page', () => {
    beforeEach(() => {
      homePage.visit();
    });

    it('ENG is selected as a default locale', () => {
      homePage.header.getLocaleButton().should('contain.text', 'ENG');
      // and all texts on home page are displayed in ENG
      // TODO
    });

    describe('and user changes the locale to DE', () => {
      beforeEach(() => {
        homePage.header.changeLocale('DE');
      });

      it('DE is applied to texts on the home page', () => {
        homePage.header.getLocaleButton().should('contain.text', 'DE');
        // and all texts on home page are displayed in DE
        // TODO
      });

      describe('and navigates through the website in SPA mode', () => {
        beforeEach(() => {
          // go to PDP
          homePage.getProductCards().eq(0).click();
        });

        it('DE texts are still applied', () => {
          // product description is displayed in DE
          // TODO
          pdp.addItemsToTheCart(1);
          // go to the cart
          pdp.header.getCartSummary().click();
          checkLocaleOnCartPage('DE');
        });
      });
    });
  });

  describe('when there is a product in the cart and user opens the cart page', () => {
    beforeEach(() => {
      const scosApi = new SCCOSApi();
      scosApi.guestCartItems.post(ProductStorage.getProductByEq(2), 1);
      cartPage.visit();
    });

    describe('and user changes the locale to DE', () => {
      beforeEach(() => {
        cartPage.header.changeLocale('DE');
      });

      describe('and user changes the locale back to ENG', () => {
        beforeEach(() => {
          cartPage.header.changeLocale('ENG');
        });

        it('ENG tests are applied on the cart page', () => {
          checkLocaleOnCartPage('ENG');
        });
      });
    });
  });
});

function checkLocaleOnCartPage(locale: string) {
  // TODO
  // cartPage.getCartTotals().getSubtotalPrice().should('contain.text', locale);
  // cartPage.getCartTotals().getTaxTotalPrice().should('contain.text', locale);
  // cartPage.getCartTotals().getTotalPrice().should('contain.text', locale);

  // cartPage.getCartEntries().then((entries) => {
  //   entries[0].getSubtotal().should('contain.text', locale);
  //   entries[0].getSalesPrice().should('contain.text', locale);
  // });
}
