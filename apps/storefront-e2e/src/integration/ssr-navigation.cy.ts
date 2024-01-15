import { GlueAPI } from '../support/apis/glue.api';
import { FooterFragment } from '../support/page-fragments/footer.fragment';
import { HeaderFragment } from '../support/page-fragments/header.fragment';
import { SearchBoxFragment } from '../support/page-fragments/search-box.fragment';
import { CheckoutPage } from '../support/page-objects/checkout.page';
import { ProductStorage } from '../support/test-data/storages/product.storage';
import { visibilityCheck } from '../support/utils';

let api: GlueAPI;

const footer = new FooterFragment();
const header = new HeaderFragment();
const searchbox = new SearchBoxFragment();

const visitOptions = {
  onBeforeLoad: (win) => {
    delete win.CSSStyleSheet.prototype.replace;
  },
};

describe('SSR suite', { tags: ['smoke', 'visual-regression'] }, () => {
  // if (isSSREnabled()) {
  // it('should render Landing page', () => {
  //   const landingPage = new LandingPage();

  //   landingPage.visit(visitOptions);

  //   verifyHeader();
  //   landingPage.getHeroBanner().should('be.visible');
  //   verifyFooter();

  //   cy.takeScreenshot('Landing Page');
  // });

  // it('should render Product details page', () => {
  //   const productData = ProductStorage.getByEq(1);
  //   const pdp = new ProductDetailsPage(productData);

  //   pdp.visit(visitOptions);

  //   verifyHeader();
  //   pdp.checkDefaultProduct();
  //   verifyFooter();

  //   cy.takeScreenshot('Product details page');
  // });

  // it('should render Contact us page', () => {
  //   const contactPage = new ContactPage();

  //   contactPage.visit(visitOptions);

  //   verifyHeader();
  //   contactPage.getHeading().should('be.visible');
  //   verifyFooter(false);

  //   cy.takeScreenshot('Contact Us page');
  // });

  // it('should render Login page', () => {
  //   const loginPage = new LoginPage();

  //   loginPage.visit(visitOptions);

  //   verifyHeader();
  //   loginPage.loginForm.getWrapper().should('be.visible');
  //   verifyFooter();

  //   cy.takeScreenshot('Login page');
  // });

  // it('should render Cart page', () => {
  //   const cartPage = new CartPage();

  //   api = new GlueAPI();

  //   cy.createGuestCart(api);
  //   cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(4));
  //   cy.goToGuestCart(visitOptions);

  //   verifyHeader();
  //   cartPage.checkNotEmptyCart();
  //   verifyFooter();

  //   cartPage.templateIsReady();

  //   cy.takeScreenshot('Cart page');
  // });

  // it('should render Search page', () => {
  //   const searchPage = new SearchPage({ q: 'TomTom' });

  //   searchPage.visit(visitOptions);

  //   verifyHeader();
  //   searchPage.getFacets().getWrapper().should('be.visible');
  //   searchPage.getProductSorting().getWrapper().should('be.visible');
  //   searchPage.getProductCards().should('have.length.greaterThan', 1);
  //   searchPage.getProductHeadings().should('contain.text', 'TomTom');
  //   verifyFooter();

  //   cy.takeScreenshot('Search page');
  // });

  // it('should render Category page', () => {
  //   const categoryPage = new CategoryPage({ id: '6' });

  //   categoryPage.visit(visitOptions);

  //   verifyHeader();
  //   categoryPage.getFacets().getWrapper().should('be.visible');
  //   categoryPage.getProductSorting().getWrapper().should('be.visible');
  //   categoryPage.getProductCards().should('have.length.greaterThan', 1);
  //   verifyFooter();

  //   cy.takeScreenshot('Category page');
  // });

  it('should render Checkout page', () => {
    const checkoutPage = new CheckoutPage();

    api = new GlueAPI();

    cy.createGuestCart(api);
    cy.addProductToGuestCart(api, 1, ProductStorage.getByEq(4));
    cy.goToGuestCheckout();

    checkoutPage.visit(visitOptions);
    verifyHeader();
    checkoutPage.getPlaceOrderBtn().should('be.visible');
    verifyFooter();

    checkoutPage.templateIsReady();

    cy.takeScreenshot('Checkout page');
  });
  // }
});

function verifyFooter(isPageScrollable = true) {
  if (isPageScrollable) {
    cy.scrollTo('bottom');
  }

  visibilityCheck(footer.getLinkByUrl('/contact'));

  const currentYear = new Date().getFullYear();

  visibilityCheck(footer.getWrapper())
    .find('oryx-content-text')
    .shadow()
    .should('contain.text', currentYear);
}

function verifyHeader() {
  header.getTopHeaderWrapper().find('oryx-content-link').should('be.visible');
  header.getLocaleSelector().should('be.visible');
  header.getCurrencySelector().should('be.visible');
  header.getUserSummaryHeading().should('be.visible');
  searchbox.getTypeahead().should('be.visible');
}
