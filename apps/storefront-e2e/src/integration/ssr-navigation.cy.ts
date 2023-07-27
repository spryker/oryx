import { CartPage } from '../support/page-objects/cart.page';
import { ContactPage } from '../support/page-objects/contact.page';
import { LandingPage } from '../support/page-objects/landing.page';
import { LoginPage } from '../support/page-objects/login.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { SearchPage } from '../support/page-objects/search.page';
import { CategoryPage } from '../support/page-objects/category.page';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';
import { FooterFragment } from '../support/page-fragments/footer.fragment';
import { HeaderFragment } from '../support/page-fragments/header.fragment';
import { SearchFragment } from '../support/page-fragments/search.fragment';
import { SCCOSApi } from '../support/sccos-api/sccos.api';

const footer = new FooterFragment();
const header = new HeaderFragment();
const search = new SearchFragment();
let sccosApi: SCCOSApi;
const verifyFooter = (isPageScrollable = true) => {
  if (isPageScrollable) {
    cy.scrollTo('bottom');
  }

  footer.getLinkByUrl('/contact').should('be.visible');

  const currentYear = new Date().getFullYear();
  footer
    .getWrapper()
    .find('oryx-text')
    .shadow()
    .should('contain.text', currentYear);
};

const verifyHeader = () => {
  header.getLocaleSelector().should('be.visible');
  header.getCurrencySelector().should('be.visible');
  header.getUserSummaryHeading().should('be.visible');
  search.getTypeahead().should('be.visible');
};

describe('SSR suite', { tags: 'smoke' }, () => {
  if (Cypress.env('isSSR')) {
    it('must render Landing page', () => {
      const landingPage = new LandingPage();

      landingPage.visit();

      verifyHeader();

      landingPage.getHeroBanner().should('be.visible');

      verifyFooter();
    });

    it('must render Product details page', () => {
      const productData = ProductStorage.getProductByEq(1);
      const pdp = new ProductDetailsPage(productData);

      pdp.visit();

      verifyHeader();

      pdp.getTitle().should('contain.text', productData.title);
      pdp.getRating().should('be.visible');
      pdp.getSKU().should('contain.text', productData.id);
      pdp.getPrice().should('contain.text', productData.originalPrice);

      pdp.getQuantityComponent().getInput().should('have.value', 1);
      pdp.getAddToCartBtn().should('be.visible');

      pdp.getImages().should('be.visible');
      pdp.getDescription().should('be.visible');
      pdp.getAttributeTerms().should('have.length', 7);

      verifyFooter();
    });

    it('must render Contact us page', () => {
      const contactPage = new ContactPage();

      contactPage.visit();

      verifyHeader();

      contactPage.getHeading().should('be.visible');

      verifyFooter(false);
    });

    it('must render Login page', () => {
      const loginPage = new LoginPage();

      loginPage.visit();

      verifyHeader();

      loginPage.loginForm.getWrapper().should('be.visible');

      verifyFooter();
    });

    it('must render Cart page', () => {
      const cartPage = new CartPage();

      cy.goToCartAsGuest();

      verifyHeader();

      cartPage.checkEmptyCart();

      verifyFooter();
    });

    it('must render Search page', () => {
      const searchPage = new SearchPage();

      searchPage.visit();

      verifyHeader();

      searchPage.getFacets().should('be.visible');
      searchPage.getProductSort().should('be.visible');
      searchPage.getOryxCards().should('have.length.greaterThan', 1);

      verifyFooter();
    });

    it('must render Category page', () => {
      const categoryId = { id: '6' };
      const categoryPage = new CategoryPage(categoryId);

      categoryPage.visit();

      verifyHeader();

      categoryPage.getFacets().should('be.visible');
      categoryPage.getProductSort().should('be.visible');
      categoryPage.getOryxCards().should('have.length.greaterThan', 1);

      verifyFooter();
    });

    it('must render Checkout page', () => {
      const checkoutPage = new CheckoutPage();
      sccosApi = new SCCOSApi();
      sccosApi.guestCarts.get();
      sccosApi.guestCartItems.post(ProductStorage.getProductByEq(4), 1);

      cy.goToCheckoutAsGuest();
      cy.location('pathname').should('be.eq', checkoutPage.anonymousUrl);
      cy.reload();

      verifyHeader();

      checkoutPage.getPlaceOrderBtn().should('be.visible');

      verifyFooter();
    });
  }
});
