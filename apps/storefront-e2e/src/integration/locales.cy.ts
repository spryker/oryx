import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { LandingPage } from '../support/page-objects/landing.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const homePage = new LandingPage();
const cartPage = new CartPage();
const pdp = new ProductDetailsPage();

describe('Locales suite', () => {
  describe('when user opens home page', () => {
    beforeEach(() => {
      homePage.visit();
    });

    it('EN is selected as a default locale', () => {
      homePage.header.getLocaleButton().should('contain.text', 'en');
      homePage.getProductCardPrices().eq(0).checkCurrencyFormatting('en');
    });

    describe('and user changes the locale to DE', () => {
      beforeEach(() => {
        homePage.header.changeLocale('de');
      });

      it('DE is applied to texts and currencies on the home page', () => {
        homePage.header.getLocaleButton().should('contain.text', 'de');
        homePage.getProductCardPrices().eq(0).checkCurrencyFormatting('de');
      });

      describe('and navigates through the website in SPA mode', () => {
        beforeEach(() => {
          // go to PDP
          homePage.getProductCards().eq(0).click();
        });

        it('DE texts and currencies are still applied', () => {
          // product description is displayed in DE
          pdp
            .getDescriptionText()
            .should(
              'contain',
              'Gear S2 X Atelier Mendini In einer wunderbaren'
            );
          pdp.getPrice().checkCurrencyFormatting('de');
          pdp.addItemsToTheCart(1, true);
          // go to the cart
          pdp.header.getCartSummary().click();
          checkCurrencyUsedOnCartPage('de');
        });
      });
    });
  });

  describe('when there is a product in the cart and user opens the cart page', () => {
    beforeEach(() => {
      const api = new GlueAPI();
      cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(2));
      cy.goToGuestCart();
    });

    describe('and user changes the locale to DE', () => {
      beforeEach(() => {
        cartPage.header.changeLocale('de');
      });

      it('DE texts and currencies are applied', () => {
        checkCurrencyUsedOnCartPage('de');
      });

      describe('and user changes the locale back to EN', () => {
        beforeEach(() => {
          // small "hack" needed for cypress
          cy.get('body').click();

          cartPage.header.changeLocale('en', true);
        });

        it('EN texts and currencies are applied', () => {
          checkCurrencyUsedOnCartPage('en');
        });
      });
    });
  });
});

function checkCurrencyUsedOnCartPage(locale: string) {
  const totals = cartPage.getCartTotals();

  totals.getSubtotalPrice().shadow().checkCurrencyFormatting(locale);
  totals.getTaxTotalPrice().shadow().checkCurrencyFormatting(locale);
  totals.getTotalPrice().shadow().checkCurrencyFormatting(locale);

  cartPage.getCartEntries().then((entries) => {
    entries[0].getSubtotal().shadow().checkCurrencyFormatting(locale);
    entries[0].getSalesPrice().shadow().checkCurrencyFormatting(locale);
  });
}
