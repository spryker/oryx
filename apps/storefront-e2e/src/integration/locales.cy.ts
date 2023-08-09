import { CartPage } from '../support/page-objects/cart.page';
import { LandingPage } from '../support/page-objects/landing.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';

const homePage = new LandingPage();
const cartPage = new CartPage();
const pdp = new ProductDetailsPage();

describe('Locales suite', () => {
  it('should show EN as a default locale', () => {
    homePage.visit();

    homePage.header.getLocaleButton().should('contain.text', 'en');
    homePage.getProductCardPrices().eq(0).checkCurrencyFormatting('en');
  });

  it('should save the locale selection when navigating on site', () => {
    homePage.visit();
    homePage.header.changeLocale('de');

    homePage.header.getLocaleButton().should('contain.text', 'de');
    homePage.getProductCardPrices().eq(0).checkCurrencyFormatting('de');

    // go to pdp
    homePage.clickOnProductCart(0);
    pdp.addItemsToTheCart(1, true);

    pdp
      .getDescriptionText()
      .should('contain', 'Gear S2 X Atelier Mendini In einer wunderbaren');
    pdp.getPrice().checkCurrencyFormatting('de');

    // go to the cart
    pdp.header.goToCart();

    checkCurrencyUsedOnCartPage('de');

    // toggle locale in the cart
    cartPage.header.changeLocale('en');

    checkCurrencyUsedOnCartPage('en');
  });
});

function checkCurrencyUsedOnCartPage(locale: string) {
  const totals = cartPage.getCartTotals;

  totals.getSubtotalPrice().shadow().checkCurrencyFormatting(locale);
  totals.getTaxTotalPrice().shadow().checkCurrencyFormatting(locale);
  totals.getTotalPrice().shadow().checkCurrencyFormatting(locale);

  cartPage.getCartEntries().then((entries) => {
    entries[0].getSubtotal().shadow().checkCurrencyFormatting(locale);
    entries[0].getSalesPrice().shadow().checkCurrencyFormatting(locale);
  });
}
