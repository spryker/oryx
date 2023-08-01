import { GlueAPI } from '../support/apis/glue.api';
import { CartPage } from '../support/page-objects/cart.page';
import { LandingPage } from '../support/page-objects/landing.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

const homePage = new LandingPage();
const cartPage = new CartPage();
const pdp = new ProductDetailsPage();

describe('Currencies suite', () => {
  describe('when user opens home page', () => {
    beforeEach(() => {
      homePage.visit();
    });

    it('EUR is selected as a default currency', () => {
      homePage.header.getCurrencyButton().should('contain.text', 'EUR');
      // and all prices on home page are displayed in EUR
      homePage.getProductCardPrices().should('contain.text', '€');
    });

    describe('and user changes the currency to CHF', () => {
      beforeEach(() => {
        homePage.header.changeCurrency('CHF');
      });

      it('CHF is applied to prices on the home page', () => {
        homePage.header.getCurrencyButton().should('contain.text', 'CHF');
        // and all prices on home page are displayed in CHF
        homePage.getProductCardPrices().should('contain.text', 'CHF');
      });

      describe('and navigates through the website in SPA mode', () => {
        beforeEach(() => {
          // go to PDP
          homePage.getProductCards().eq(0).click();
        });

        it('CHF price is still applied', () => {
          // product price is displayed in CHF
          pdp.getPrice().should('contain.text', 'CHF');
          pdp.addItemsToTheCart(1, true);
          // go to the cart
          pdp.header.getCartSummary().click();
          // cart currencies are not switched automatically
          checkCurrencyOnCartPage('€');
        });
      });
    });
  });

  describe('when there is a product in the cart and user opens the cart page', () => {
    beforeEach(() => {
      cy.addItemsToTheGuestCart(new GlueAPI(), 1, ProductStorage.getByEq(2));
      cy.goToGuestCart();
    });

    describe('and user changes the currency to CHF', () => {
      beforeEach(() => {
        cartPage.header.changeCurrency('CHF');
      });

      it('CHF prices are NOT applied on the cart page', () => {
        // cart currencies are not switched automatically
        checkCurrencyOnCartPage('€');
      });

      describe('and user changes the currency back to EUR', () => {
        beforeEach(() => {
          // small "hack" needed for cypress
          cy.get('body').click();

          cartPage.header.changeCurrency('EUR', true);
        });

        it('EUR prices are applied on the cart page', () => {
          checkCurrencyOnCartPage('€');
        });
      });
    });
  });
});

function checkCurrencyOnCartPage(currency: string) {
  const totals = cartPage.getCartTotals();

  totals.getSubtotalPrice().shadow().should('contain.text', currency);
  totals.getTaxTotalPrice().shadow().should('contain.text', currency);
  totals.getTotalPrice().shadow().should('contain.text', currency);

  cartPage.getCartEntries().then((entries) => {
    entries[0].getSubtotal().shadow().should('contain.text', currency);
    entries[0].getSalesPrice().shadow().should('contain.text', currency);
  });
}
