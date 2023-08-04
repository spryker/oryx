import { GlueAPI } from '../support/apis/glue.api';
import { FooterFragment } from '../support/page-fragments/footer.fragment';
import { HeaderFragment } from '../support/page-fragments/header.fragment';
import { SearchBoxFragment } from '../support/page-fragments/search-box.fragment';
import { CartPage } from '../support/page-objects/cart.page';
import { CategoryPage } from '../support/page-objects/category.page';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ContactPage } from '../support/page-objects/contact.page';
import { LandingPage } from '../support/page-objects/landing.page';
import { LoginPage } from '../support/page-objects/login.page';
import { ProductDetailsPage } from '../support/page-objects/product-details.page';
import { SearchPage } from '../support/page-objects/search.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';

let api: GlueAPI;

const footer = new FooterFragment();
const header = new HeaderFragment();
const searchbox = new SearchBoxFragment();

describe('SSR suite', { tags: 'smoke' }, () => {
  if (Cypress.env('isSSR')) {
    it('should render Landing page', () => {
      const landingPage = new LandingPage();

      landingPage.visit();

      verifyHeader();

      landingPage.getHeroBanner().should('be.visible');

      verifyFooter();
    });

    it('should render Product details page', () => {
      const productData = ProductStorage.getByEq(1);
      const pdp = new ProductDetailsPage(productData);

      pdp.visit();

      verifyHeader();

      pdp.checkDefaultProduct();

      verifyFooter();
    });

    it('should render Contact us page', () => {
      const contactPage = new ContactPage();

      contactPage.visit();

      verifyHeader();

      contactPage.getHeading().should('be.visible');

      verifyFooter(false);
    });

    it('should render Login page', () => {
      const loginPage = new LoginPage();

      loginPage.visit();

      verifyHeader();

      loginPage.loginForm.getWrapper().should('be.visible');

      verifyFooter();
    });

    it('should render Cart page', () => {
      const cartPage = new CartPage();

      cy.goToGuestCart();

      verifyHeader();

      cartPage.checkEmptyCart();

      verifyFooter();
    });

    it('should render Search page', () => {
      const searchPage = new SearchPage();

      searchPage.visit();

      verifyHeader();

      searchPage.getFacets().should('be.visible');
      searchPage.getProductSort().should('be.visible');
      searchPage.getOryxCards().should('have.length.greaterThan', 1);

      verifyFooter();
    });

    it('should render Category page', () => {
      const categoryData = { id: '6' };
      const categoryPage = new CategoryPage(categoryData);

      categoryPage.visit();

      verifyHeader();

      categoryPage.getFacets().should('be.visible');
      categoryPage.getProductSort().should('be.visible');
      categoryPage.getOryxCards().should('have.length.greaterThan', 1);

      verifyFooter();
    });

    it('should render Checkout page', () => {
      const checkoutPage = new CheckoutPage();

      api = new GlueAPI();

      cy.createGuestCart(api);
      cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(4));
      cy.goToGuestCheckout();

      // trigger ssr
      cy.reload();

      verifyHeader();

      checkoutPage.getPlaceOrderBtn().should('be.visible');

      verifyFooter();
    });
  }
});

function verifyFooter(isPageScrollable = true) {
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
}

function verifyHeader() {
  header.getLocaleSelector().should('be.visible');
  header.getCurrencySelector().should('be.visible');
  header.getUserSummaryHeading().should('be.visible');
  searchbox.getTypeahead().should('be.visible');
}
